export enum Permission {
  // User Management
  USERS_READ = 'users:read',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',

  // Tenant Management
  TENANTS_READ = 'tenants:read',
  TENANTS_CREATE = 'tenants:create',
  TENANTS_UPDATE = 'tenants:update',
  TENANTS_DELETE = 'tenants:delete',

  // Shift Management
  SHIFTS_READ = 'shifts:read',
  SHIFTS_CREATE = 'shifts:create',
  SHIFTS_UPDATE = 'shifts:update',
  SHIFTS_DELETE = 'shifts:delete',

  // Invite Management
  INVITES_CREATE = 'invites:create',
  INVITES_READ = 'invites:read',

  // Department Management
  DEPARTMENTS_READ = 'departments:read',
  DEPARTMENTS_CREATE = 'departments:create',
  DEPARTMENTS_UPDATE = 'departments:update',
  DEPARTMENTS_DELETE = 'departments:delete',

  // Patient Management
  PATIENTS_READ = 'patients:read',
  PATIENTS_CREATE = 'patients:create',
  PATIENTS_UPDATE = 'patients:update',
  PATIENTS_DELETE = 'patients:delete',

  // Encounter Management
  ENCOUNTERS_READ = 'encounters:read',
  ENCOUNTERS_CREATE = 'encounters:create',
  ENCOUNTERS_UPDATE = 'encounters:update',
  ENCOUNTERS_DELETE = 'encounters:delete',

  // Schedule Management
  SCHEDULES_READ = 'schedules:read',
  SCHEDULES_CREATE = 'schedules:create',
  SCHEDULES_UPDATE = 'schedules:update',
  SCHEDULES_DELETE = 'schedules:delete',

  // Handover Management
  HANDOVERS_READ = 'handovers:read',
  HANDOVERS_CREATE = 'handovers:create',
  HANDOVERS_UPDATE = 'handovers:update',
  HANDOVERS_DELETE = 'handovers:delete',

  // Carelog Management
  CARELOG_READ = 'carelog:read',
  CARELOG_CREATE = 'carelog:create',
  CARELOG_UPDATE = 'carelog:update',
  CARELOG_DELETE = 'carelog:delete',

  //Role Management
  ROLE_READ = 'role:read',
  ROLE_CREATE = 'role:create',
  ROLE_DELETE = 'role:delete',
  ROLE_PERMISSION_UPDATE = 'roles:update',
}
