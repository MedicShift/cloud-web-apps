export class CreatePatientCommand {
  constructor(
    public readonly mrn: string,
    public readonly tenantId?: string,
  ) {}
}
