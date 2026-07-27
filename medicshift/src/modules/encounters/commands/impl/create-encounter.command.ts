import { EncounterStatus } from '../../enums/encounters.status';
import { EncounterType } from '../../enums/encounters.encounterType';

export class CreateEncounterCommand {
  constructor(
    public readonly patientId: string,
    public readonly departmentId: string,
    public readonly encounterType: EncounterType,
    public readonly bedNumber: string | undefined,
    public readonly status: EncounterStatus | undefined,
    public readonly admittedAt: string,
    public readonly dischargedAt: string | undefined,
    public readonly tenantId: string,
  ) {}
}
