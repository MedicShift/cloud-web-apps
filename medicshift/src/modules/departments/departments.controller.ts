import { UseGuards, Controller, Post, Body, Get, Query, Param, Patch, Delete, Req } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateDepartmentCommand } from './commands/impl/create-department.command';
import { UpdateDepartmentCommand } from './commands/impl/update-department.command';
import { DeleteDepartmentCommand } from './commands/impl/delete-department.command';
import { GetDepartmentQuery } from './queries/impl/get-department.query';
import { GetDepartmentsQuery } from './queries/impl/get-departments.query';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'departments', version: '1' })
export class DepartmentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  create(@Body() dto: CreateDepartmentDto, @Req() req: any) {
    return this.commandBus.execute(new CreateDepartmentCommand(dto.name, req.user.tenantId));
  }

  @Get('all')
  @ApiOperation({ summary: 'List all departments' })
  @ApiQuery({ name: 'tenant', required: false, type: String })
  findAll(@Req() req: any) {
    console.log('req' , req)
    return this.queryBus.execute(new GetDepartmentsQuery(req.user.tenantId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a department by ID' })
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetDepartmentQuery(id));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a department' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.commandBus.execute(new UpdateDepartmentCommand(id, updateDto));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department' })
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteDepartmentCommand(id));
  }
}
