import { UserRole } from 'src/modules/users/enums/user-role.enum';

export class SendInviteCommand {
  constructor(
    public readonly email: string,
    public readonly tenantId: string,
    public readonly invitedBy: string,
    public readonly role?: UserRole,
  ) {}
}
