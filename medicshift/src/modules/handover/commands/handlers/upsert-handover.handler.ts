import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException } from '@nestjs/common';
import { UpsertHandoverCommand } from '../impl/upsert-handover.command';
import { HandoverRepository } from '../../repositories/handover.repository';
import { Handover } from '../../entities/handover.entity';

@CommandHandler(UpsertHandoverCommand)
export class UpsertHandoverHandler implements ICommandHandler<UpsertHandoverCommand> {
  constructor(private readonly handoverRepository: HandoverRepository) {}

  async execute(command: UpsertHandoverCommand): Promise<Handover> {
    const {
      tenantId,
      scheduleId,
      authorId,
      entries,
      recipientId,
      status,
      submittedAt,
    } = command;

    const encounterIds = entries.map((entry) => entry.encounterId);
    if (new Set(encounterIds).size !== encounterIds.length) {
      throw new ConflictException(
        'Duplicate encounter found across handover entries',
      );
    }

    return this.handoverRepository.upsertHandoverWithEntries(
      { tenantId, scheduleId },
      {
        authorId,
        recipientId,
        status,
        submittedAt: submittedAt ? new Date(submittedAt) : null,
      },
      entries,
    );
  }
}
