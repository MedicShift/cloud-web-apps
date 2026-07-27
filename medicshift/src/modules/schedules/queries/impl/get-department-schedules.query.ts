export class GetDepartmentSchedulesQuery {
  constructor(
    public readonly departmentId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly tenantId?: string,
  ) {}
}
