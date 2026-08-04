import { UseGuards, Controller, Param, Delete, Post, Body, Get, Put, } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateRoleCommand } from './commands/impl/create-role.command';
import { DeleteRoleCommand } from './commands/impl/delete-role.command';
import { GetRoleQuery } from './queries/impl/get-role.query';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRolePermissionsCommand } from './commands/impl/update-role-permission-command';
import { UpdateRolePermissionsDto } from './dtos/update-role-permission.dto';

@ApiTags('Roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'roles', version: '1' })
export class RoleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @RequirePermissions(Permission.ROLE_CREATE)
  @Post()
  @ApiOperation({ summary: 'add patient' })
  create(
    @Body() dto: CreateRoleDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new CreateRoleCommand(dto.name, dto.permissions, tenantId),
    );
  }

  @RequirePermissions(Permission.ROLE_DELETE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeleteRoleCommand(id, tenantId));
  }

  @RequirePermissions(Permission.ROLE_READ)
  @Get('all')
  @ApiOperation({ summary: 'List all roles' })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetRoleQuery(tenantId));
  }

  @RequirePermissions(Permission.ROLE_PERMISSION_UPDATE)
  @Put(':id/permissions')
  @ApiOperation({ summary: 'Update role permissions' })
  updatePermissions(
    @Param('id') id: string,
    @Body() dto: UpdateRolePermissionsDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new UpdateRolePermissionsCommand(id, dto.permissions, tenantId),
    );
  }
}
