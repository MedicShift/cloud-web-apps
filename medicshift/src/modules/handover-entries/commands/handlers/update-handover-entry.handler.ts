import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateHandoverEntryCommand } from '../impl/update-handover-entry.command';
import { HandoverEntriesRepository } from '../../repositories/handover-entries.repository';
import { HandoverEntry } from '../../entities/handover-entry.entity';

@CommandHandler(UpdateHandoverEntryCommand)
export class UpdateHandoverEntryHandler implements ICommandHandler<UpdateHandoverEntryCommand> {
  constructor(
    private readonly handoverEntriesRepository: HandoverEntriesRepository,
  ) {}

  async execute(command: UpdateHandoverEntryCommand): Promise<HandoverEntry> {
    const {
      id,
      tenantId,
      handoverId,
      encounterId,
      situation,
      background,
      assessment,
      recommendation,
    } = command;

    await this.handoverEntriesRepository.assertBelongsToTenant(
      handoverId,
      encounterId,
      tenantId,
    );

    return this.handoverEntriesRepository.updateHandoverEntry(id, tenantId, {
      handoverId,
      encounterId,
      situation,
      background,
      assessment,
      recommendation,
    });
  }
}
