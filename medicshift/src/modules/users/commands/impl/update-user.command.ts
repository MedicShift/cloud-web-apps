export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly updateData: Record<string, any>,
  ) {}
}
