import { Request } from 'express';
import { UserRole } from '../../modules/users/enums/user-role.enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  departmentId?: string;
  iat?: number;
  exp?: number;
}
