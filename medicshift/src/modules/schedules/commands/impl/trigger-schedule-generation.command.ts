export class TriggerScheduleGenerationCommand {
  constructor(
    public readonly departmentId: string,
    public readonly tenantId: string,
    public readonly startDate: string,
    public readonly endDate: string,
  ) {}
}
