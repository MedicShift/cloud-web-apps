import { UseGuards, Controller, Post, Body, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
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
  ) { }

  // @Roles(UserRole.ADMIN, UserRole.MANAGER)
  // @Post()
  // @ApiOperation({ summary: 'Create a new user' })
  // create(@Body() dto: CreateUserDto) {
  //   return this.commandBus.execute(
  //     new CreateUserCommand(
  //       dto.email,
  //       dto.password,
  //       dto.firstName,
  //       dto.lastName,
  //       dto.role,
  //       dto.tenantId,
  //     ),
  //   );
  // }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get('all')
  @ApiOperation({ summary: 'Get all users (filter by hospital if manager)' })
  findAll(@Query('tenantId') tenantId?: string) {
    return this.queryBus.execute(new GetUsersQuery(tenantId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetUserQuery(id));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.commandBus.execute(new UpdateUserCommand(id, dto));
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteUserCommand(id));
  }
}
