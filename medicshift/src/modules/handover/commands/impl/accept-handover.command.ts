export class AcceptHandoverCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly recipientId: string,
  ) {}
}
