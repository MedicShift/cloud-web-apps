export class RegisterUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly roleId?: string,
    public readonly tenantId?: string,
    public readonly departmentId?: string,
  ) {}
}
