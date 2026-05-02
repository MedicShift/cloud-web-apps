import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Tenant } from '../../entities/tenant.entity';
import { TenantRepository } from '../../repositories/tenant.repository';
import { GetTenantsQuery } from '../impl/get-tenants.query';

@QueryHandler(GetTenantsQuery)
export class GetTenantsHandler implements IQueryHandler<GetTenantsQuery> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(): Promise<Tenant[]> {
    return this.tenantRepository.findAll();
  }
}
