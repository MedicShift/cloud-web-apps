import { AppDataSource } from './src/config/data-source';
import { Role } from './src/modules/roles/entities/role.entity';

import { Permission } from './src/modules/auth/enums/permission.enum';

async function run() {
  await AppDataSource.initialize();
  const roleRepository = AppDataSource.getRepository(Role);

  const systemAdminPermissions = Object.values(Permission);

  const hospitalAdminPermissions = Object.values(Permission).filter(
    (p) => p !== Permission.TENANTS_CREATE && p !== Permission.TENANTS_DELETE,
  );

  const managerPermissions = [
    Permission.TENANTS_READ,
    Permission.USERS_READ,
    Permission.USERS_UPDATE,
    Permission.SHIFTS_READ,
    Permission.SHIFTS_CREATE,
    Permission.SHIFTS_UPDATE,
    Permission.SHIFTS_DELETE,
    Permission.INVITES_CREATE,
    Permission.INVITES_READ,
    Permission.DEPARTMENTS_READ,
    Permission.DEPARTMENTS_CREATE,
    Permission.DEPARTMENTS_UPDATE,
    Permission.DEPARTMENTS_DELETE,
    Permission.PATIENTS_READ,
    Permission.PATIENTS_CREATE,
    Permission.PATIENTS_UPDATE,
    Permission.PATIENTS_DELETE,
    Permission.ENCOUNTERS_READ,
    Permission.ENCOUNTERS_CREATE,
    Permission.ENCOUNTERS_UPDATE,
    Permission.ENCOUNTERS_DELETE,
    Permission.SCHEDULES_READ,
    Permission.SCHEDULES_CREATE,
    Permission.SCHEDULES_UPDATE,
    Permission.SCHEDULES_DELETE,
    Permission.HANDOVERS_READ,
    Permission.HANDOVERS_CREATE,
    Permission.HANDOVERS_UPDATE,
    Permission.HANDOVERS_DELETE,
  ];

  const userPermissions = [
    Permission.USERS_READ,
    Permission.SHIFTS_READ,
    Permission.DEPARTMENTS_READ,
    Permission.PATIENTS_READ,
    Permission.ENCOUNTERS_READ,
    Permission.SCHEDULES_READ,
    Permission.HANDOVERS_READ,
    Permission.HANDOVERS_CREATE,
  ];

  const roles = [
    roleRepository.create({
      name: 'System Admin',
      isCustom: false,
      permissions: systemAdminPermissions,
      tenantId: null,
    }),
    roleRepository.create({
      name: 'Hospital Admin',
      isCustom: false,
      permissions: hospitalAdminPermissions,
      tenantId: null,
    }),
    roleRepository.create({
      name: 'Manager',
      isCustom: false,
      permissions: managerPermissions,
      tenantId: null,
    }),
    roleRepository.create({
      name: 'User',
      isCustom: false,
      permissions: userPermissions,
      tenantId: null,
    }),
  ];

  await roleRepository.save(roles);

  console.log('Seed successful');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
