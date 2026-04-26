import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginUserCommand } from '../impl/login-user.command';
import { UserRepository } from '../../../users/repositories/user.repository';
import { AuditLogService } from '../../../../common/audit/audit-log.service';

@CommandHandler(LoginUserCommand)
export class LoginUserHandler implements ICommandHandler<LoginUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditLog: AuditLogService,
  ) {}

  async execute(command: LoginUserCommand) {
    const { email, password, ip } = command;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      this.auditLog.authFailure(email, ip, { reason: 'user_not_found' });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check account lockout
    if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
      this.auditLog.authFailure(email, ip, { reason: 'account_locked' });
      throw new ForbiddenException(
        'Account is temporarily locked due to too many failed login attempts. Please try again later.',
      );
    }

    // Validate password with pepper
    const pepper = this.configService.get<string>('security.passwordPepper');
    const pepperedPassword = `${pepper}${password}`;
    const isPasswordValid =
      user.password && (await bcrypt.compare(pepperedPassword, user.password));

    if (!isPasswordValid) {
      // Increment failed attempts
      const lockoutThreshold =
        this.configService.get<number>('security.lockoutThreshold') || 5;
      const lockoutDuration =
        this.configService.get<number>('security.lockoutDurationMinutes') || 15;
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;

      const updateData: Record<string, any> = {
        failedLoginAttempts: failedAttempts,
      };

      if (failedAttempts >= lockoutThreshold) {
        const lockUntil = new Date(Date.now() + lockoutDuration * 60 * 1000);
        updateData.lockedUntil = lockUntil;
        this.auditLog.authLockout(email, ip);
      }

      await this.userRepository.updateUser(user.id, updateData);
      this.auditLog.authFailure(email, ip, {
        reason: 'invalid_password',
        failedAttempts,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed attempts on successful login
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await this.userRepository.updateUser(user.id, {
        failedLoginAttempts: 0,
        lockedUntil: null,
      });
    }

    // Generate access token (short-lived)
    const accessPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      hospitalId: user.hospitalId,
    };
    const accessToken = this.jwtService.sign(accessPayload);

    // Generate refresh token (long-lived)
    const refreshTokenSecret = this.configService.get<string>(
      'security.refreshTokenSecret',
    );
    const refreshTokenExpiration = this.configService.get<string>(
      'security.refreshTokenExpiration',
    );
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: refreshTokenSecret, expiresIn: refreshTokenExpiration as any },
    );

    // Store hashed refresh token in DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.updateUser(user.id, { hashedRefreshToken });

    this.auditLog.authSuccess(email, user.id, ip);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}
