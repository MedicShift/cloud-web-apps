export class GetUserSchedulesQuery {
  constructor(
    public readonly userId: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly tenantId?: string,
    public readonly requestingDepartmentId?: string,
  ) {}
}
