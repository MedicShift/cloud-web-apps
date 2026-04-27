import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Tenant } from '../../entities/tenant.entity';
import { CreateTenantCommand } from '../impl/create-tenant.command';
import { TenantRepository } from '../../repositories/tenant.repository';

@CommandHandler(CreateTenantCommand)
export class CreateHospitalHandler implements ICommandHandler<CreateTenantCommand> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(command: CreateTenantCommand): Promise<Tenant> {
    return this.tenantRepository.createTenant(command.data);
  }
}
