export class DeleteEncounterCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
