import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RefreshTokenCommand } from '../impl/refresh-token.command';
import { UserRepository } from '../../../users/repositories/user.repository';
import { AuditLogService } from '../../../../common/audit/audit-log.service';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly auditLog: AuditLogService,
  ) {}

  async execute(command: RefreshTokenCommand) {
    const { userId, refreshToken } = command;

    // Fetch user directly by ID for refresh
    const userById = await this.userRepository.findOneById(userId);
    // We need the hashedRefreshToken - re-fetch with select
    const userWithToken = await this.userRepository.findByEmail(userById.email);

    if (!userWithToken || !userWithToken.hashedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Verify refresh token against stored hash
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      userWithToken.hashedRefreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Issue new access token
    const accessPayload = {
      email: userWithToken.email,
      sub: userWithToken.id,
      role: userWithToken.role,
      tenantId: userWithToken.tenantId,
    };
    const newAccessToken = this.jwtService.sign(accessPayload);

    // Rotate refresh token
    const refreshTokenSecret = this.configService.get<string>(
      'security.refreshTokenSecret',
    );
    const refreshTokenExpiration = this.configService.get<string>(
      'security.refreshTokenExpiration',
    );
    const newRefreshToken = this.jwtService.sign(
      { sub: userWithToken.id },
      {
        secret: refreshTokenSecret,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expiresIn: refreshTokenExpiration as any,
      },
    );

    // Store new hashed refresh token (rotation)
    const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.userRepository.updateUser(
      userWithToken.id,
      userWithToken.tenantId,
      {
        hashedRefreshToken: hashedNewRefreshToken,
      },
    );

    this.auditLog.authTokenRefresh(userWithToken.id);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
}
