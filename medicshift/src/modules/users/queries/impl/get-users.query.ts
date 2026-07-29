export class GetUsersQuery {
  constructor(
    public readonly tenantId: string,
    public readonly departmentId?: string,
    public readonly roleId?: string,
  ) {}
}
