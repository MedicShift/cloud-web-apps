import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetScheduleQuery } from '../impl/get-schedule.query';
import { ScheduleRepository } from '../../repositories/schedule.repository';
import { Schedule } from '../../entities/schedule.entity';

@QueryHandler(GetScheduleQuery)
export class GetScheduleHandler implements IQueryHandler<GetScheduleQuery> {
  constructor(private readonly scheduleRepository: ScheduleRepository) {}

  async execute(query: GetScheduleQuery): Promise<Schedule> {
    return this.scheduleRepository.findOneById(query.id);
  }
}
