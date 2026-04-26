import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateScheduleCommand } from '../impl/create-schedule.command';
import { ScheduleRepository } from '../../repositories/schedule.repository';
import { Schedule } from '../../entities/schedule.entity';

@CommandHandler(CreateScheduleCommand)
export class CreateScheduleHandler implements ICommandHandler<CreateScheduleCommand> {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(command: CreateScheduleCommand): Promise<Schedule> {
    return this.scheduleRepository.createSchedule(command.data);
  }
}
