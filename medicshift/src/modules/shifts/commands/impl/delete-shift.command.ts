export class DeleteShiftCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
