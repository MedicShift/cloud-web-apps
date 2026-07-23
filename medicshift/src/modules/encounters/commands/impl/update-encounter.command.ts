import { EncounterStatus } from '../../enums/encounters.status';
import { EncounterType } from '../../enums/encounters.encounterType';

export class UpdateEncounterCommand {
  constructor(
    public readonly encounterId: string,
    public readonly tenantId: string,
    public readonly patientId: string,
    public readonly departmentId: string,
    public readonly encounterType: EncounterType,
    public readonly bedNumber: string,
    public readonly status: EncounterStatus,
    public readonly admittedAt: string,
    public readonly dischargedAt: string | undefined,
  ) {}
}
