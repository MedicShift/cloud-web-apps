import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TriggerScheduleGenerationCommand } from '../impl/trigger-schedule-generation.command';
import { DepartmentRepository } from '../../../departments/repositories/department.repository';
import { ShiftRepository } from '../../../shifts/repositories/shift.repository';
import { ScheduleRepository } from '../../repositories/schedule.repository';

@CommandHandler(TriggerScheduleGenerationCommand)
class TriggerScheduleGenerationHandler implements ICommandHandler<TriggerScheduleGenerationCommand> {
  constructor(
    private readonly departmentRepository: DepartmentRepository,
    private readonly schedulesRepository: ScheduleRepository,
    private readonly shiftsRepository: ShiftRepository,
  ) {}

  async execute(command: TriggerScheduleGenerationCommand): Promise<any> {
    const department = await this.departmentRepository.findOneById(
      command.departmentId,
      command.tenantId,
    );

    const shifts = await this.shiftsRepository.findAll(command.tenantId);

    const payload = {
      departmentId: department.id,
      startDate: command.startDate,
      endDate: command.endDate,
      shifts: shifts,
      users: department.users.map((user) => ({
        id: user.id,
      })),
    };

    const response = await fetch('http://127.0.0.1:8000/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const d = await response.json();
      await this.schedulesRepository.saveSchedules(command.tenantId, d.days)
      return d;
    }

    return false;
  }
}

export default TriggerScheduleGenerationHandler;
