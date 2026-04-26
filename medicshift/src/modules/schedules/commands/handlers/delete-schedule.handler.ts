import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteScheduleCommand } from '../impl/delete-schedule.command';
import { ScheduleRepository } from '../../repositories/schedule.repository';

@CommandHandler(DeleteScheduleCommand)
export class DeleteScheduleHandler implements ICommandHandler<DeleteScheduleCommand> {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(command: DeleteScheduleCommand): Promise<void> {
    return this.scheduleRepository.deleteSchedule(command.id);
  }
}
