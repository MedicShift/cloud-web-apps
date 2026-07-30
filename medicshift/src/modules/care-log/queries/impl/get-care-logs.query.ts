export class GetCareLogsQuery {
  constructor(
    public readonly handoverEntryId: string,
    public readonly tenantId: string,
  ) {}
}
