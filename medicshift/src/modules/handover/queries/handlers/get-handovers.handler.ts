import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHandoversQuery } from '../impl/get-handovers.query';
import { HandoverRepository } from '../../repositories/handover.repository';
import { Handover } from '../../entities/handover.entity';

@QueryHandler(GetHandoversQuery)
export class GetHandoversHandler implements IQueryHandler<GetHandoversQuery> {
  constructor(private readonly handoverRepository: HandoverRepository) {}

  async execute(query: GetHandoversQuery): Promise<Handover[]> {
    return this.handoverRepository.findAll(query.tenantId);
  }
}
