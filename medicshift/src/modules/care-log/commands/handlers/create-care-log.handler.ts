import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCareLogCommand } from '../impl/create-care-log.command';
import { CareLogRepository } from '../../repositories/care-log.repository';
import { CareLog } from '../../entities/care-log.entity';
import { CareLogStatus } from '../../enums/care-log-status.enum';

@CommandHandler(CreateCareLogCommand)
export class CreateCareLogHandler implements ICommandHandler<CreateCareLogCommand> {
  constructor(private readonly careLogRepository: CareLogRepository) {}

  async execute(command: CreateCareLogCommand): Promise<CareLog> {
    const {
      tenantId,
      handoverEntryId,
      encounterId,
      category,
      description,
      scheduledAt,
      recordedAt,
      status,
    } = command;

    return this.careLogRepository.createCareLog({
      tenantId,
      handoverEntryId,
      encounterId,
      category,
      description,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      recordedAt: recordedAt ? new Date(recordedAt) : null,
      status: status ?? CareLogStatus.PENDING,
    });
  }
}
