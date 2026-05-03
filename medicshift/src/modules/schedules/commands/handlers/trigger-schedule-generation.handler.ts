import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { TriggerScheduleGenerationCommand } from '../impl/trigger-schedule-generation.command';
import { ScheduleRepository } from '../../repositories/schedule.repository';
import { ScheduleStatus } from '../../enums/schedule-status.enum';
import { Schedule } from '../../entities/schedule.entity';

@CommandHandler(TriggerScheduleGenerationCommand)
export class TriggerScheduleGenerationHandler implements ICommandHandler<TriggerScheduleGenerationCommand> {
  private readonly logger = new Logger(TriggerScheduleGenerationHandler.name);

  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(command: TriggerScheduleGenerationCommand): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOneById(
      command.id,
      command.tenantId,
    );
    schedule.status = ScheduleStatus.GENERATING;
    await this.scheduleRepository.saveSchedule(schedule);

    // Fire off async task to python microservice here
    this.logger.log(`Triggering schedule generation for ${command.id}`);

    return schedule;
  }
}
