export class UpdateDepartmentCommand {
  constructor(
    public readonly id: string,
    public readonly updateData: Record<string, any>,
  ) {}
}
