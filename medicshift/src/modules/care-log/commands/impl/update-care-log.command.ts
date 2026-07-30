import { CareLogCategory } from '../../enums/care-log-category.enum';
import { CareLogStatus } from '../../enums/care-log-status.enum';

export class UpdateCareLogCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly handoverEntryId: string,
    public readonly encounterId: string,
    public readonly category: CareLogCategory,
    public readonly description: string,
    public readonly status: CareLogStatus,
    public readonly scheduledAt?: string,
    public readonly recordedAt?: string,
  ) {}
}
