import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ScheduleRepository } from '../../repositories/schedule.repository';
import { Schedule } from '../../entities/schedule.entity';
import { GetDepartmentSchedulesQuery } from '../impl/get-department-schedules.query';

@QueryHandler(GetDepartmentSchedulesQuery)
export class GetDepartmentSchedulesHandler implements IQueryHandler<GetDepartmentSchedulesQuery> {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(query: GetDepartmentSchedulesQuery): Promise<Schedule[]> {
    return this.scheduleRepository.findByDepartmentAndDateRange(
      query.departmentId,
      query.startDate,
      query.endDate,
      query.tenantId,
    );
  }
}
