import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateRolePermissionsCommand } from '../impl/update-role-permission-command';
import { RoleRepository } from '../../repositories/role.repository';
import { Role } from '../../entities/role.entity';

@CommandHandler(UpdateRolePermissionsCommand)
export class UpdateRolePermissionsHandler implements ICommandHandler<UpdateRolePermissionsCommand> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(command: UpdateRolePermissionsCommand): Promise<Role> {
    const { roleId, permissions, tenantId} = command;

    const role = await this.roleRepository.findOneById(roleId, tenantId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return this.roleRepository.updateRole(roleId, tenantId, { permissions });
  }
}
