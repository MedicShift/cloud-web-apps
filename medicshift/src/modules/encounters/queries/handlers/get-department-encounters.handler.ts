import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { EncountersRepository } from '../../repositories/encounters.repository';
import { Encounter } from '../../entities/encounter.entity';
import { GetDepartmentEncountersQuery } from '../impl/get-department-encounters.query';

@QueryHandler(GetDepartmentEncountersQuery)
export class GetDepartmentEncountersHandler
  implements IQueryHandler<GetDepartmentEncountersQuery>
{
  constructor(private readonly encountersRepository: EncountersRepository) {}

  async execute(query: GetDepartmentEncountersQuery): Promise<Encounter[]> {
    return this.encountersRepository.findByDepartmentId(
      query.departmentId,
      query.tenantId,
    );
  }
}
