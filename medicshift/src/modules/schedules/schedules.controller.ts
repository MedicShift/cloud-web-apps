import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { UpdateScheduleDto } from './dtos/update-schedule.dto';
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
import { CreateScheduleCommand } from './commands/impl/create-schedule.command';
import { DeleteScheduleCommand } from './commands/impl/delete-schedule.command';
import { UpdateScheduleCommand } from './commands/impl/update-schedule.command';
import { TriggerScheduleGenerationCommand } from './commands/impl/trigger-schedule-generation.command';
import { GetScheduleQuery } from './queries/impl/get-schedule.query';
import { GetSchedulesQuery } from './queries/impl/get-schedules.query';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateTriggerScheduleDto } from './dtos/trigger-schedule-generation.dto';
import { GetUserSchedulesQuery } from './queries/impl/get-user-schedules.query';
import { GetDepartmentSchedulesQuery } from './queries/impl/get-department-schedules.query';

@ApiTags('Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'schedules', version: '1' })
export class SchedulesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @RequirePermissions(Permission.SCHEDULES_CREATE)
  @Post()
  @ApiOperation({ summary: 'Create a new schedule parameter block' })
  create(
    @Body() dto: CreateScheduleDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new CreateScheduleCommand({ ...dto, tenantId }),
    );
  }

  @RequirePermissions(Permission.SCHEDULES_READ)
  @Get()
  @ApiOperation({ summary: 'List all schedules' })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetSchedulesQuery(tenantId));
  }

  @RequirePermissions(Permission.SCHEDULES_READ)
  @Get('user')
  @ApiOperation({ summary: 'Get users schedule entries in date range' })
  findUserSchedules(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser('id') currentUserId: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('departmentId') departmentId: string,
    @Query('userId') userId?: string,
  ) {
    const targetUserId = userId || currentUserId;
    return this.queryBus.execute(
      new GetUserSchedulesQuery(
        targetUserId,
        new Date(startDate),
        new Date(endDate),
        tenantId,
        departmentId,
      ),
    );
  }

  @RequirePermissions(Permission.SCHEDULES_READ)
  @Get(':id')
  @ApiOperation({ summary: 'Get a schedule and its entries by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetScheduleQuery(id, tenantId));
  }

  @RequirePermissions(Permission.SCHEDULES_CREATE)
  @Post('generate')
  @ApiOperation({ summary: 'Trigger OR-Tools to generate the schedule' })
  triggerGeneration(
    @Body() dto: CreateTriggerScheduleDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new TriggerScheduleGenerationCommand(
        dto.departmentId,
        tenantId,
        dto.startDate,
        dto.endDate,
      ),
    );
  }

  @RequirePermissions(Permission.SCHEDULES_UPDATE)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a schedule' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateScheduleDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new UpdateScheduleCommand(id, tenantId, updateDto),
    );
  }

  @RequirePermissions(Permission.SCHEDULES_DELETE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeleteScheduleCommand(id, tenantId));
  }

  @RequirePermissions(Permission.SCHEDULES_READ)
  @Get('department/:id')
  @ApiOperation({
    summary: 'Get a schedule of users in that department in date range',
  })
  findDepartmentSchedules(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.queryBus.execute(
      new GetDepartmentSchedulesQuery(
        id,
        new Date(startDate),
        new Date(endDate),
        tenantId,
      ),
    );
  }
}
