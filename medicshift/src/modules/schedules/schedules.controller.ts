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
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'schedules', version: '1' })
export class SchedulesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
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

  @Get()
  @ApiOperation({ summary: 'List all schedules' })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetSchedulesQuery(tenantId));
  }

  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.MANAGER)
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a schedule and its entries by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetScheduleQuery(id, tenantId));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
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

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a schedule' })
  update(
    @Param('id') id: string,
    @Body() updateDto: Record<string, any>,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new UpdateScheduleCommand(id, tenantId, updateDto),
    );
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeleteScheduleCommand(id, tenantId));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
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
