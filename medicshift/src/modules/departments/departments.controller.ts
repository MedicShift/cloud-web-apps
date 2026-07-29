import {
  UseGuards,
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestWithUser } from '../../common/interfaces/request-with-user.interface';

@ApiTags('Departments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'departments', version: '1' })
export class DepartmentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @RequirePermissions(Permission.DEPARTMENTS_CREATE)
  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  create(
    @Body() dto: CreateDepartmentDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new CreateDepartmentCommand({ ...dto, tenantId }),
    );
  }

  @RequirePermissions(Permission.DEPARTMENTS_READ)
  @Get('all')
  @ApiOperation({ summary: 'List all departments' })
  @ApiQuery({ name: 'tenant', required: false, type: String })
  findAll(@Req() req: RequestWithUser) {
    return this.queryBus.execute(new GetDepartmentsQuery(req.user.tenantId));
  }

  @RequirePermissions(Permission.DEPARTMENTS_READ)
  @Get(':id')
  @ApiOperation({ summary: 'Get a department by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetDepartmentQuery(id, tenantId));
  }

  @RequirePermissions(Permission.DEPARTMENTS_UPDATE)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a department' })
  update(
    @Param('id') id: string,
    @Body() updateDto: Record<string, any>,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new UpdateDepartmentCommand(id, tenantId, updateDto),
    );
  }

  @RequirePermissions(Permission.DEPARTMENTS_DELETE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a department' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeleteDepartmentCommand(id, tenantId));
  }
}
