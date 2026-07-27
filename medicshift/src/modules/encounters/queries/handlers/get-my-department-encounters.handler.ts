import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EncountersRepository } from '../../repositories/encounters.repository';
import { Encounter } from '../../entities/encounter.entity';
import { GetMyDepartmentEncountersQuery } from '../impl/get-my-department-encounters.query';

@QueryHandler(GetMyDepartmentEncountersQuery)
export class GetMyDepartmentEncountersHandler implements IQueryHandler<GetMyDepartmentEncountersQuery> {
  constructor(private readonly encountersRepository: EncountersRepository) {}

  async execute(query: GetMyDepartmentEncountersQuery): Promise<Encounter[]> {
    return this.encountersRepository.findByDepartmentId(
      query.departmentId,
      query.tenantId,
    );
  }
}
