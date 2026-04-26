import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateShiftCommand } from '../impl/create-shift.command';
import { ShiftRepository } from '../../repositories/shift.repository';
import { Shift } from '../../entities/shift.entity';

@CommandHandler(CreateShiftCommand)
export class CreateShiftHandler implements ICommandHandler<CreateShiftCommand> {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async execute(command: CreateShiftCommand): Promise<Shift> {
    return this.shiftRepository.createShift(command.data);
  }
}
