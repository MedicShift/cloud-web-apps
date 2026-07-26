export class GetDepartmentEncountersQuery {
  constructor(
    public readonly departmentId: string,
    public readonly tenantId: string,
  ) {}
}
