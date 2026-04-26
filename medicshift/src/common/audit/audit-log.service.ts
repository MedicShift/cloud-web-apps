import { Injectable, Logger } from '@nestjs/common';

export enum AuditEvent {
  AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS',
  AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE',
  AUTH_LOCKOUT = 'AUTH_LOCKOUT',
  AUTH_REGISTER = 'AUTH_REGISTER',
  AUTH_LOGOUT = 'AUTH_LOGOUT',
  AUTH_TOKEN_REFRESH = 'AUTH_TOKEN_REFRESH',
  ENTITY_CREATED = 'ENTITY_CREATED',
  ENTITY_UPDATED = 'ENTITY_UPDATED',
  ENTITY_DELETED = 'ENTITY_DELETED',
}

export interface AuditLogEntry {
  event: AuditEvent;
  userId?: string;
  email?: string;
  ip?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger('AuditLog');

  log(entry: AuditLogEntry): void {
    this.logger.log(
      {
        ...entry,
        timestamp: new Date().toISOString(),
      },
      `[AUDIT] ${entry.event}`,
    );
  }

  authSuccess(email: string, userId: string, ip?: string): void {
    this.log({ event: AuditEvent.AUTH_LOGIN_SUCCESS, email, userId, ip });
  }

  authFailure(
    email: string,
    ip?: string,
    metadata?: Record<string, any>,
  ): void {
    this.log({ event: AuditEvent.AUTH_LOGIN_FAILURE, email, ip, metadata });
  }

  authLockout(email: string, ip?: string): void {
    this.log({ event: AuditEvent.AUTH_LOCKOUT, email, ip });
  }

  authRegister(email: string, userId: string): void {
    this.log({ event: AuditEvent.AUTH_REGISTER, email, userId });
  }

  authLogout(userId: string): void {
    this.log({ event: AuditEvent.AUTH_LOGOUT, userId });
  }

  authTokenRefresh(userId: string): void {
    this.log({ event: AuditEvent.AUTH_TOKEN_REFRESH, userId });
  }
}
