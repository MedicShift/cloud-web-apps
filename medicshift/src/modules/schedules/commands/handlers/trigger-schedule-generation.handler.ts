import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TriggerScheduleGenerationCommand } from '../impl/trigger-schedule-generation.command';
import { DepartmentRepository } from '../../../departments/repositories/department.repository';
import {
  ScheduleRepository,
  GeneratedScheduleDays,
} from '../../repositories/schedule.repository';

interface ScheduleGenerationResponse {
  days: GeneratedScheduleDays;
}

@CommandHandler(TriggerScheduleGenerationCommand)
export class TriggerScheduleGenerationHandler implements ICommandHandler<TriggerScheduleGenerationCommand> {
  private readonly logger = new Logger(TriggerScheduleGenerationHandler.name);

  constructor(
    private readonly departmentRepository: DepartmentRepository,
    private readonly schedulesRepository: ScheduleRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(command: TriggerScheduleGenerationCommand): Promise<any> {
    const department = await this.departmentRepository.findOneByIdForSchedule(
      command.departmentId,
      command.tenantId,
    );

    const payload = {
      departmentId: department.id,
      startDate: command.startDate,
      endDate: command.endDate,
      shifts: department.shifts,
      users: department.users.map((user) => ({ id: user.id })),
    };

    const url = this.configService.getOrThrow<string>('SCHEDULER_URL');
    this.logger.log(
      `Triggering schedule generation for department ${command.departmentId}`,
    );

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      this.logger.error('Schedule service unreachable', err);
      throw new InternalServerErrorException('Schedule service unreachable');
    }

    if (!response.ok) {
      const text = await response.text();
      this.logger.error(
        `Schedule service returned ${response.status}: ${text}`,
      );
      throw new InternalServerErrorException(
        `Schedule service error: ${response.status}`,
      );
    }

    const d = (await response.json()) as ScheduleGenerationResponse;
    if (!d?.days) {
      this.logger.error('Schedule service response missing days field', d);
      throw new InternalServerErrorException(
        'Invalid response from schedule service',
      );
    }

    await this.schedulesRepository.saveSchedules(command.tenantId, d.days);
    return d;
  }
}
