export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly updateData: Record<string, any>,
  ) {}
}
