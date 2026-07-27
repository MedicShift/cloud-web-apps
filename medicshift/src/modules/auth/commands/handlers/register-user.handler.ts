import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { RegisterUserCommand } from '../impl/register-user.command';
import { UserRepository } from '../../../users/repositories/user.repository';
import { AuditLogService } from '../../../../common/audit/audit-log.service';
import { UserRole } from '../../../users/enums/user-role.enum';
import { InviteRepository } from '../../../invite/repositories/invite.repository';
import { InviteStatus } from '../../../invite/enums/invite-status';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly auditLog: AuditLogService,
    private readonly inviteRepository: InviteRepository,
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

    // Update invite status if registered via invite
    const pendingInvite = await this.inviteRepository.findPendingByEmail(email);
    if (pendingInvite) {
      pendingInvite.status = InviteStatus.ACCEPTED;
      pendingInvite.acceptedAt = new Date();
      await this.inviteRepository.save(pendingInvite);
    }

    const result = { ...user } as Record<string, any>;
    delete result.passwordHash;
    delete result.hashedRefreshToken;
    return result;
  }
}
