import { UpdateScheduleDto } from '../../dtos/update-schedule.dto';

export class UpdateScheduleCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly updateData: UpdateScheduleDto,
  ) {}
}
