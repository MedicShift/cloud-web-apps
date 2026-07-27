import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEncounterQuery } from '../impl/get-encounter.query';
import { EncountersRepository } from '../../repositories/encounters.repository';
import { Encounter } from '../../entities/encounter.entity';

@QueryHandler(GetEncounterQuery)
export class GetEncounterHandler implements IQueryHandler<GetEncounterQuery> {
  constructor(private readonly encountersRepository: EncountersRepository) {}

  async execute(query: GetEncounterQuery): Promise<Encounter> {
    return this.encountersRepository.findOneById(query.id, query.tenantId);
  }
}
