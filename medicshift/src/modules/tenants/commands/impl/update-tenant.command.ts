import { UpdateTenantDto } from '../../dtos/update-tenant.dto';

export class UpdateTenantCommand {
  constructor(
    public readonly id: string,
    public readonly updateData: UpdateTenantDto,
  ) {}
}
