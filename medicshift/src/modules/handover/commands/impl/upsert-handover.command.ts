import { HandoverStatus } from '../../enums/handover-status.enum';

export interface UpsertHandoverEntryItem {
  encounterId: string;
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
}

export class UpsertHandoverCommand {
  constructor(
    public readonly tenantId: string,
    public readonly scheduleId: string,
    public readonly authorId: string,
    public readonly entries: UpsertHandoverEntryItem[],
    public readonly recipientId?: string,
    public readonly status?: HandoverStatus,
    public readonly submittedAt?: string,
  ) {}
}
