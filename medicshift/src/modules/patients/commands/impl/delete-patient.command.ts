export class DeletePatientCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
