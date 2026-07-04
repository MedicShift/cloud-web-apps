import { UserRole } from '../../enums/user-role.enum';

export class GetUsersQuery {
  constructor(
    public readonly tenantId: string,
    public readonly departmentId?: string,
    public readonly role?: UserRole){}
}
