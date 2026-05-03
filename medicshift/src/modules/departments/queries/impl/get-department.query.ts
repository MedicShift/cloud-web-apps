export class GetDepartmentQuery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
