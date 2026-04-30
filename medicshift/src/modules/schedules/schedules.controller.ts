import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query,} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery} from '@nestjs/swagger';
import { CreateScheduleCommand } from './commands/impl/create-schedule.command';
import { DeleteScheduleCommand } from './commands/impl/delete-schedule.command';
import { TriggerScheduleGenerationCommand } from './commands/impl/trigger-schedule-generation.command';
import { GetScheduleQuery } from './queries/impl/get-schedule.query';
import { GetSchedulesQuery } from './queries/impl/get-schedules.query';

@ApiTags('Schedules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'schedules', version: '1' })
export class SchedulesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) { }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  @ApiOperation({ summary: 'Create a new schedule parameter block' })
  create(@Body() dto: CreateScheduleDto) {
    return this.commandBus.execute(new CreateScheduleCommand(dto));
  }

  @Get()
  @ApiOperation({ summary: 'List all schedules' })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  findAll(@Query('tenantId') tenantId?: string) {
    return this.queryBus.execute(new GetSchedulesQuery(tenantId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a schedule and its entries by ID' })
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetScheduleQuery(id));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post(':id/generate')
  @ApiOperation({ summary: 'Trigger OR-Tools to generate the schedule' })
  triggerGeneration(@Param('id') id: string) {
    return this.commandBus.execute(new TriggerScheduleGenerationCommand(id));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a schedule' })
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteScheduleCommand(id));
  }
}
