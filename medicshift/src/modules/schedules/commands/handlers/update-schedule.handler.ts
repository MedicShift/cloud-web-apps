import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateScheduleCommand } from '../impl/update-schedule.command';
import { ScheduleRepository } from '../../repositories/schedule.repository';
import { Schedule } from '../../entities/schedule.entity';

@CommandHandler(UpdateScheduleCommand)
export class UpdateScheduleHandler implements ICommandHandler<UpdateScheduleCommand> {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(command: UpdateScheduleCommand): Promise<Schedule> {
    const { userId, shiftId, date, status } = command.updateData;
    return this.scheduleRepository.updateSchedule(command.id, command.tenantId, {
      ...(userId && { userId }),
      ...(shiftId && { shiftId }),
      ...(date && { date: new Date(date) }),
      ...(status && { status }),
    });
  }
}
