import { CareLogCategory } from '../../enums/care-log-category.enum';
import { CareLogStatus } from '../../enums/care-log-status.enum';

export class CreateCareLogCommand {
  constructor(
    public readonly tenantId: string,
    public readonly handoverEntryId: string,
    public readonly encounterId: string,
    public readonly category: CareLogCategory,
    public readonly description: string,
    public readonly scheduledAt?: string,
    public readonly recordedAt?: string,
    public readonly status?: CareLogStatus,
  ) {}
}
