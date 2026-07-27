import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { CreateHandoverEntryCommand } from '../impl/create-handover-entry.command';
import { HandoverEntriesRepository } from '../../repositories/handover-entries.repository';
import { HandoverEntry } from '../../entities/handover-entry.entity';

@CommandHandler(CreateHandoverEntryCommand)
export class CreateHandoverEntryHandler implements ICommandHandler<CreateHandoverEntryCommand> {
  constructor(
    private readonly handoverEntriesRepository: HandoverEntriesRepository,
  ) {}

  async execute(command: CreateHandoverEntryCommand): Promise<HandoverEntry> {
    const {
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

    const existing =
      await this.handoverEntriesRepository.findByHandoverAndEncounter(
        handoverId,
        encounterId,
        tenantId,
      );
    if (existing) {
      throw new ConflictException(
        'An entry for this patient already exists in this handover',
      );
    }

    return this.handoverEntriesRepository.createHandoverEntry({
      tenantId,
      handoverId,
      encounterId,
      situation,
      background,
      assessment,
      recommendation,
    });
  }
}
