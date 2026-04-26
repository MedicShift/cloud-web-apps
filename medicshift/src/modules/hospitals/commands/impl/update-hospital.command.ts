export class UpdateHospitalCommand {
  constructor(
    public readonly id: string,
    public readonly updateData: Record<string, any>,
  ) {}
}
