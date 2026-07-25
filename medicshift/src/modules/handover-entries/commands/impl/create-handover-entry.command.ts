export class CreateHandoverEntryCommand {
  constructor(
    public readonly tenantId: string,
    public readonly handoverId: string,
    public readonly encounterId: string,
    public readonly situation: string,
    public readonly background: string,
    public readonly assessment: string,
    public readonly recommendation: string,
  ) {}
}
