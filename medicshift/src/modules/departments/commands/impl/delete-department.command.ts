export class DeleteDepartmentCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
