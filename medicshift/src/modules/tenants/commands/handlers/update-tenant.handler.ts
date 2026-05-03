import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Tenant } from '../../entities/tenant.entity';
import { UpdateTenantCommand } from '../impl/update-tenant.command';
import { TenantRepository } from '../../repositories/tenant.repository';

@CommandHandler(UpdateTenantCommand)
export class UpdateTenantHandler implements ICommandHandler<UpdateTenantCommand> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(command: UpdateTenantCommand): Promise<Tenant> {
    const { id, updateData } = command;
    const tenant = await this.tenantRepository.findById(id);

    Object.assign(tenant, updateData);

    return this.tenantRepository.saveTenant(tenant);
  }
}
