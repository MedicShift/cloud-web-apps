export class SendInviteCommand {
  constructor(
    public readonly email: string,
    public readonly tenantId: string,
    public readonly invitedBy: string,
    public readonly roleId?: string,
    public readonly roleName?: string,
    public readonly departmentId?: string,
  ) {}
}
