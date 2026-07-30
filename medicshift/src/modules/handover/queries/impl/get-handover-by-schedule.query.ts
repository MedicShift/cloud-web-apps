export class GetHandoverByScheduleQuery {
  constructor(
    public readonly scheduleId: string,
    public readonly tenantId: string,
  ) {}
}
