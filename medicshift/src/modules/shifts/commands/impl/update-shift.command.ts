export class UpdateShiftCommand {
  constructor(
    public readonly id: string,
    public readonly updateData: Record<string, any>,
  ) {}
}
