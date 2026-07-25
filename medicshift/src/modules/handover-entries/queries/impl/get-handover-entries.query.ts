export class GetHandoverEntriesQuery {
  constructor(
    public readonly handoverId: string,
    public readonly tenantId: string,
  ) {}
}
