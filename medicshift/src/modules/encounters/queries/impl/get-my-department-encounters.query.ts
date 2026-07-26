export class GetMyDepartmentEncountersQuery {
  constructor(
    public readonly departmentId: string,
    public readonly tenantId: string,
  ) {}
}
