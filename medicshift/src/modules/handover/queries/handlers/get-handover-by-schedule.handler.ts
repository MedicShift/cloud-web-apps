import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HandoverRepository } from '../../repositories/handover.repository';
import { Handover } from '../../entities/handover.entity';
import { GetHandoverByScheduleQuery } from '../impl/get-handover-by-schedule.query';

@QueryHandler(GetHandoverByScheduleQuery)
export class GetHandoverByScheduleHandler implements IQueryHandler<GetHandoverByScheduleQuery> {
  constructor(private readonly handoverRepository: HandoverRepository) {}

  async execute(query: GetHandoverByScheduleQuery): Promise<Handover[]> {
    const handover = await this.handoverRepository.findByScheduleId(
      query.scheduleId,
      query.tenantId,
    );

    return handover ? [handover] : [];
  }
}
