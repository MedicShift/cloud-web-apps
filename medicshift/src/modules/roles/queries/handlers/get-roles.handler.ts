import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RoleRepository } from '../../repositories/role.repository';
import { Role } from '../../entities/role.entity';
import { GetRoleQuery } from '../impl/get-role.query';

@QueryHandler(GetRoleQuery)
export class GetRolesHandler implements IQueryHandler<GetRoleQuery> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(query: GetRoleQuery): Promise<Role[]> {
    return this.roleRepository.findTenantOnly(query.tenantId);
  }
}
