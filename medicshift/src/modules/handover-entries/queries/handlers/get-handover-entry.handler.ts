import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHandoverEntryQuery } from '../impl/get-handover-entry.query';
import { HandoverEntriesRepository } from '../../repositories/handover-entries.repository';
import { HandoverEntry } from '../../entities/handover-entry.entity';

@QueryHandler(GetHandoverEntryQuery)
export class GetHandoverEntryHandler implements IQueryHandler<GetHandoverEntryQuery> {
  constructor(
    private readonly handoverEntriesRepository: HandoverEntriesRepository,
  ) {}

  async execute(query: GetHandoverEntryQuery): Promise<HandoverEntry> {
    return this.handoverEntriesRepository.findOneById(query.id, query.tenantId);
  }
}
