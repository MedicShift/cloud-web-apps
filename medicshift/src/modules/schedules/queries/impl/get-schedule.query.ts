export class GetScheduleQuery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
