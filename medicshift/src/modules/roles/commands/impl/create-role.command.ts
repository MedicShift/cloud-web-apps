import { Permission } from '../../../auth/enums/permission.enum';

export class CreateRoleCommand {
  constructor(
    public readonly name: string,
    public readonly permissions: Permission[],
    public readonly tenantId: string,
  ) {}
}
