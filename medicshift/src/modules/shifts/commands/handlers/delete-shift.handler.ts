import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteShiftCommand } from '../impl/delete-shift.command';
import { ShiftRepository } from '../../repositories/shift.repository';

@CommandHandler(DeleteShiftCommand)
export class DeleteShiftHandler implements ICommandHandler<DeleteShiftCommand> {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async execute(command: DeleteShiftCommand): Promise<void> {
    return this.shiftRepository.deleteShift(command.id, command.tenantId);
  }
}
