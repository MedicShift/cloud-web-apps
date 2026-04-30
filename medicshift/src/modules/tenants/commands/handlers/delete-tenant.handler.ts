import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTenantCommand } from '../impl/delete-tenant.command';
import { TenantRepository } from '../../repositories/tenant.repository';

@CommandHandler(DeleteTenantCommand)
export class DeleteTenantHandler implements ICommandHandler<DeleteTenantCommand> {
  constructor(private readonly tenantRepository: TenantRepository) {}

  async execute(command: DeleteTenantCommand): Promise<void> {
    return this.tenantRepository.remove(command.id);
  }
}
