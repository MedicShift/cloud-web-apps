import { Permission } from '../../../auth/enums/permission.enum';

export class UpdateRolePermissionsCommand {
  constructor(
    public readonly roleId: string,
    public readonly permissions: Permission[],
    public readonly tenantId: string,
  ) {}
}
