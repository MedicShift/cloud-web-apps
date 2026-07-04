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
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from './enums/user-role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { GetUserQuery } from './queries/impl/get-user.query';
import { GetUsersQuery } from './queries/impl/get-users.query';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'users', version: '1' })
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Get all users for the authenticated user's tenant",
  })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('departmentId') userDeptId: string,
    @CurrentUser('role') role: UserRole,
    @Query('departmentId') departmentId?: string,
    @Query('role') queryRole?: UserRole,
  ) {
    let finalDepartmentId: string | undefined;

    if (role === UserRole.USER) {
      finalDepartmentId = userDeptId;
    }
    else if (departmentId && departmentId !== 'all') {
      finalDepartmentId = departmentId;
    }

    return this.queryBus.execute(
      new GetUsersQuery(tenantId, finalDepartmentId, queryRole),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetUserQuery(id, tenantId));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(new UpdateUserCommand(id, tenantId, dto));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeleteUserCommand(id, tenantId));
  }
}
