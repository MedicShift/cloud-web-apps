import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterUserCommand } from '../impl/register-user.command';
import { UserRepository } from '../../../users/repositories/user.repository';
import { AuditLogService } from '../../../../common/audit/audit-log.service';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly auditLog: AuditLogService,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { email, password, firstName, lastName, role, hospitalId } = command;

    // Check for existing user
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Pepper + bcrypt hash
    const pepper = this.configService.get<string>('security.passwordPepper');
    const pepperedPassword = `${pepper}${password}`;
    const hashedPassword = await bcrypt.hash(pepperedPassword, 12);

    const user = await this.userRepository.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role as any,
      hospitalId,
    });

    // Audit log
    this.auditLog.authRegister(email, user.id);

    const { password: _pw, hashedRefreshToken: _rt, ...result } = user;
    return result;
  }
}
