import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHandoverQuery } from '../impl/get-handover.query';
import { HandoverRepository } from '../../repositories/handover.repository';
import { Handover } from '../../entities/handover.entity';

@QueryHandler(GetHandoverQuery)
export class GetHandoverHandler implements IQueryHandler<GetHandoverQuery> {
  constructor(private readonly handoverRepository: HandoverRepository) {}

  async execute(query: GetHandoverQuery): Promise<Handover> {
    return this.handoverRepository.findOneById(query.id, query.tenantId);
  }
}
