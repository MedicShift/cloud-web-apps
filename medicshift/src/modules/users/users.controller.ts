import {
  UseGuards,
  Controller,
  Get,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { GetUserQuery } from './queries/impl/get-user.query';
import { GetUsersQuery } from './queries/impl/get-users.query';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @RequirePermissions(Permission.USERS_READ)
  @Get()
  @ApiOperation({
    summary: "Get all users for the authenticated user's tenant",
  })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('departmentId') departmentId?: string,
    @Query('roleId') queryRoleId?: string,
  ) {
    let finalDepartmentId: string | undefined;

    if (departmentId && departmentId !== 'all') {
      finalDepartmentId = departmentId;
    }

    return this.queryBus.execute(
      new GetUsersQuery(tenantId, finalDepartmentId, queryRoleId),
    );
  }

  @RequirePermissions(Permission.USERS_READ)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetUserQuery(id, tenantId));
  }

  @RequirePermissions(Permission.USERS_UPDATE)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(new UpdateUserCommand(id, tenantId, dto));
  }

  @RequirePermissions(Permission.USERS_DELETE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeleteUserCommand(id, tenantId));
  }
}
