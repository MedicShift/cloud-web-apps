export class GetMyHandoverQuery {
  constructor(
    public readonly userId: string,
    public readonly tenantId: string,
  ) {}
}
