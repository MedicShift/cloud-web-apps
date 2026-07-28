export class GetMyHandoverQuery {
  constructor(
    public readonly userId: string,
    public readonly tenantId: string,
    public readonly startDate: string,
    public readonly endDate: string,
  ) {}
}
