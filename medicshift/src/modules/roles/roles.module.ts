import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleRepository } from './repositories/role.repository';
import { RoleController } from './role.controller';
import { CreateRoleHandler } from './commands/handlers/create-role.handler';
import { DeleteRoleHandler } from './commands/handlers/delete-role.handler';
import { GetRolesHandler } from './queries/handlers/get-roles.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateRolePermissionsHandler } from './commands/handlers/update-role-permission-handler';


const CommandHandlers = [
  CreateRoleHandler,
  DeleteRoleHandler,
  UpdateRolePermissionsHandler,
];
const QueryHandlers = [GetRolesHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Role]), CqrsModule],
  controllers: [RoleController],
  providers: [RoleRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [RoleRepository],
})
export class RolesModule {}
