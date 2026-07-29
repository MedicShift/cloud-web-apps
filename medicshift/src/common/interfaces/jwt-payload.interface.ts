import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  email: string;
  permissions: string[];
  roleId?: string;
  tenantId?: string;
  departmentId?: string;
  iat?: number;
  exp?: number;
}
