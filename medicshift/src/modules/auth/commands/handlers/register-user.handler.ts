import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterUserCommand } from '../impl/register-user.command';
import { UserRepository } from '../../../users/repositories/user.repository';
import { AuditLogService } from '../../../../common/audit/audit-log.service';
import { UserRole } from '../../../users/enums/user-role.enum';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly auditLog: AuditLogService,
  ) {}

  async execute(command: RegisterUserCommand) {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      tenantId,
      departmentId,
    } = command;

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
      passwordHash: hashedPassword,
      firstName,
      lastName,
      role: role as UserRole,
      tenantId,
      departmentId,
    });

    // Audit log
    this.auditLog.authRegister(email, user.id);

    const result = { ...user } as Record<string, any>;
    delete result.passwordHash;
    delete result.hashedRefreshToken;
    return result;
  }
}
