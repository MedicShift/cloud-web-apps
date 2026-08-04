import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRoleCommand } from '../impl/create-role.command';
import { RoleRepository } from '../../repositories/role.repository';
import { Role } from '../../entities/role.entity';

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(command: CreateRoleCommand): Promise<Role> {
    const { name, permissions, tenantId } = command;
    return this.roleRepository.createCustomRole({
      name,
      permissions,
      tenantId,
      isCustom: true,
    });
  }
}
