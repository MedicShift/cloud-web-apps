import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { HandoverRepository } from '../../repositories/handover.repository';
import { Handover } from '../../entities/handover.entity';
import { GetMyHandoverQuery } from '../impl/get-my-handover.query';

@QueryHandler(GetMyHandoverQuery)
export class GetMyHandoverHandler implements IQueryHandler<GetMyHandoverQuery> {
  constructor(private readonly handoverRepository: HandoverRepository) {}

  async execute(query: GetMyHandoverQuery): Promise<Handover[]> {
    return this.handoverRepository.findMine(query.userId, query.tenantId);
  }
}
