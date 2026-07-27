import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHandoverEntriesQuery } from '../impl/get-handover-entries.query';
import { HandoverEntriesRepository } from '../../repositories/handover-entries.repository';
import { HandoverEntry } from '../../entities/handover-entry.entity';

@QueryHandler(GetHandoverEntriesQuery)
export class GetHandoverEntriesHandler implements IQueryHandler<GetHandoverEntriesQuery> {
  constructor(
    private readonly handoverEntriesRepository: HandoverEntriesRepository,
  ) {}

  async execute(query: GetHandoverEntriesQuery): Promise<HandoverEntry[]> {
    return this.handoverEntriesRepository.findByHandover(
      query.handoverId,
      query.tenantId,
    );
  }
}
