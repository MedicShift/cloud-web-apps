export class DeleteCareLogCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
