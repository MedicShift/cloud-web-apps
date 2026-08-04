import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RoleRepository } from '../../repositories/role.repository';
import { DeleteRoleCommand } from '../impl/delete-role.command';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleHandler implements ICommandHandler<DeleteRoleCommand> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(command: DeleteRoleCommand): Promise<void> {
    return this.roleRepository.deleteRole(command.id, command.tenantId);
  }
}
