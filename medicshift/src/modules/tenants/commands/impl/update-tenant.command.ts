export class UpdateTenantCommand {
  constructor(
    public readonly id: string,
    public readonly updateData: Record<string, any>,
  ) {}
}
