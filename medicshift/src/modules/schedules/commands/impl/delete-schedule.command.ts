export class DeleteScheduleCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
