export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly roleId?: string,
    public readonly tenantId?: string,
  ) {}
}
