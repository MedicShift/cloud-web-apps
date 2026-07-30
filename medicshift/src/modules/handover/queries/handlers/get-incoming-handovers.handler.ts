import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HandoverRepository } from '../../repositories/handover.repository';
import { Handover } from '../../entities/handover.entity';
import { GetIncomingHandoversQuery } from '../impl/get-incoming-handovers.query';

@QueryHandler(GetIncomingHandoversQuery)
export class GetIncomingHandoversHandler implements IQueryHandler<GetIncomingHandoversQuery> {
  constructor(private readonly handoverRepository: HandoverRepository) {}

  async execute(query: GetIncomingHandoversQuery): Promise<Handover[]> {
    return this.handoverRepository.findIncoming(
      query.userId,
      query.tenantId,
      query.startDate,
      query.endDate,
    );
  }
}
