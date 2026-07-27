import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEncountersQuery } from '../impl/get-encounters.query';
import { EncountersRepository } from '../../repositories/encounters.repository';
import { Encounter } from '../../entities/encounter.entity';

@QueryHandler(GetEncountersQuery)
export class GetEncountersHandler implements IQueryHandler<GetEncountersQuery> {
  constructor(private readonly encountersRepository: EncountersRepository) {}

  async execute(query: GetEncountersQuery): Promise<Encounter[]> {
    return this.encountersRepository.findAll(query.tenantId);
  }
}
