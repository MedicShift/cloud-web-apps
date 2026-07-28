import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { AcceptHandoverCommand } from '../impl/accept-handover.command';
import { HandoverRepository } from '../../repositories/handover.repository';
import { Handover } from '../../entities/handover.entity';
import { HandoverStatus } from '../../enums/handover-status.enum';

@CommandHandler(AcceptHandoverCommand)
export class AcceptHandoverHandler implements ICommandHandler<AcceptHandoverCommand> {
  constructor(private readonly handoverRepository: HandoverRepository) {}

  async execute(command: AcceptHandoverCommand): Promise<Handover> {
    const { id, tenantId, recipientId } = command;

    const handover = await this.handoverRepository.findOneById(id, tenantId);

    if (handover.recipientId !== recipientId) {
      throw new ForbiddenException(
        'Only the assigned recipient can accept this handover',
      );
    }

    if (handover.status !== HandoverStatus.SUBMITTED) {
      throw new ConflictException('Only submitted handovers can be accepted');
    }

    handover.status = HandoverStatus.ACCEPTED;
    handover.acknowledgedAt = new Date();

    return this.handoverRepository.save(handover);
  }
}
