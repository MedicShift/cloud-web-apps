import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from '../impl/logout.command';
import { UserRepository } from '../../../users/repositories/user.repository';
import { AuditLogService } from '../../../../common/audit/audit-log.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auditLog: AuditLogService,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    // Invalidate refresh token by nulling it in DB
    await this.userRepository.updateUser(command.userId, {
      hashedRefreshToken: null,
    });
    this.auditLog.authLogout(command.userId);
  }
}
