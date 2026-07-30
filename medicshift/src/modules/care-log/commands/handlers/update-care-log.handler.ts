import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateCareLogCommand } from '../impl/update-care-log.command';
import { CareLogRepository } from '../../repositories/care-log.repository';
import { CareLog } from '../../entities/care-log.entity';

@CommandHandler(UpdateCareLogCommand)
export class UpdateCareLogHandler implements ICommandHandler<UpdateCareLogCommand> {
  constructor(private readonly careLogRepository: CareLogRepository) {}

  async execute(command: UpdateCareLogCommand): Promise<CareLog> {
    const {
      id,
      tenantId,
      handoverEntryId,
      encounterId,
      category,
      description,
      status,
      scheduledAt,
      recordedAt,
    } = command;

    return this.careLogRepository.updateCareLog(id, tenantId, {
      handoverEntryId,
      encounterId,
      category,
      description,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      recordedAt: recordedAt ? new Date(recordedAt) : null,
    });
  }
}
