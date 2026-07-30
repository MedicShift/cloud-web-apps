import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCareLogsQuery } from '../impl/get-care-logs.query';
import { CareLogRepository } from '../../repositories/care-log.repository';
import { CareLog } from '../../entities/care-log.entity';

@QueryHandler(GetCareLogsQuery)
export class GetCareLogsHandler implements IQueryHandler<GetCareLogsQuery> {
  constructor(private readonly careLogRepository: CareLogRepository) {}

  async execute(query: GetCareLogsQuery): Promise<CareLog[]> {
    return this.careLogRepository.findByHandoverEntry(
      query.handoverEntryId,
      query.tenantId,
    );
  }
}
