import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ScheduleRepository } from '../../repositories/schedule.repository';
import { Schedule } from '../../entities/schedule.entity';
import { GetUserSchedulesQuery } from '../impl/get-user-schedules.query';

@QueryHandler(GetUserSchedulesQuery)
export class GetUserSchedulesHandler implements IQueryHandler<GetUserSchedulesQuery> {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(query: GetUserSchedulesQuery): Promise<Schedule[]> {
    return this.scheduleRepository.findByUserAndDateRange(
      query.userId,
      query.startDate,
      query.endDate,
      query.tenantId,
      query.requestingDepartmentId,
    );
  }
}
