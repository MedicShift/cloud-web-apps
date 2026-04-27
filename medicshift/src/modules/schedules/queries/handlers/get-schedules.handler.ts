import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSchedulesQuery } from '../impl/get-schedules.query';
import { ScheduleRepository } from '../../repositories/schedule.repository';
import { Schedule } from '../../entities/schedule.entity';

@QueryHandler(GetSchedulesQuery)
export class GetSchedulesHandler implements IQueryHandler<GetSchedulesQuery> {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(query: GetSchedulesQuery): Promise<Schedule[]> {
    return this.scheduleRepository.findAll(query.tenantId);
  }
}
