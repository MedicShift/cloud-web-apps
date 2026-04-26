import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateShiftCommand } from '../impl/update-shift.command';
import { ShiftRepository } from '../../repositories/shift.repository';
import { Shift } from '../../entities/shift.entity';

@CommandHandler(UpdateShiftCommand)
export class UpdateShiftHandler implements ICommandHandler<UpdateShiftCommand> {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async execute(command: UpdateShiftCommand): Promise<Shift> {
    return this.shiftRepository.updateShift(command.id, command.updateData);
  }
}
