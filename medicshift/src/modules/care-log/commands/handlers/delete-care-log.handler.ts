import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCareLogCommand } from '../impl/delete-care-log.command';
import { CareLogRepository } from '../../repositories/care-log.repository';

@CommandHandler(DeleteCareLogCommand)
export class DeleteCareLogHandler implements ICommandHandler<DeleteCareLogCommand> {
  constructor(private readonly careLogRepository: CareLogRepository) {}

  async execute(command: DeleteCareLogCommand): Promise<void> {
    return this.careLogRepository.deleteCareLog(command.id, command.tenantId);
  }
}
