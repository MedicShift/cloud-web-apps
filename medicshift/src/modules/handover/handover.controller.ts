import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpsertHandoverDto } from './dtos/upsert-handover.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetHandoversQuery } from './queries/impl/get-handovers.query';
import { UpsertHandoverCommand } from './commands/impl/upsert-handover.command';
import { AcceptHandoverCommand } from './commands/impl/accept-handover.command';
import { GetMyHandoverQuery } from './queries/impl/get-my-handover.query';
import { GetIncomingHandoversQuery } from './queries/impl/get-incoming-handovers.query';
import { GetHandoverByScheduleQuery } from './queries/impl/get-handover-by-schedule.query';
import { GetHandoverEntriesQuery } from '../handover-entries/queries/impl/get-handover-entries.query';

@ApiTags('Handovers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'handover', version: '1' })
export class HandoverController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @RequirePermissions(Permission.HANDOVERS_CREATE)
  @Post()
  @ApiOperation({
    summary: 'Create or update a handover',
    description:
      'Upserts by (tenantId, scheduleId) — one handover per schedule, authored by the caller. If a handover already exists for that schedule, it is updated in place (including re-submitting/signing a draft) instead of creating a duplicate.',
  })
  upsert(
    @Body() dto: UpsertHandoverDto,
    @CurrentUser('id') authorId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new UpsertHandoverCommand(
        tenantId,
        dto.scheduleId,
        authorId,
        dto.entries,
        dto.recipientId,
        dto.status,
        dto.submittedAt,
      ),
    );
  }

  @Post(':id/accept')
  @ApiOperation({
    summary: 'Accept a handover',
    description:
      'Marks a submitted handover as accepted by its assigned recipient, recording acknowledgedAt.',
  })
  accept(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new AcceptHandoverCommand(id, tenantId, userId),
    );
  }

  @RequirePermissions(Permission.HANDOVERS_READ)
  @Get('all')
  @ApiOperation({ summary: 'List all handovers' })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetHandoversQuery(tenantId));
  }

  @RequirePermissions(Permission.HANDOVERS_READ)
  @Get('mine')
  @ApiOperation({
    summary: 'List my handovers',
    description:
      'Optionally filter by the date of the schedule each handover was created for, using startDate/endDate (YYYY-MM-DD).',
  })
  findMyHandovers(
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.queryBus.execute(
      new GetMyHandoverQuery(userId, tenantId, startDate, endDate),
    );
  }

  @RequirePermissions(Permission.HANDOVERS_READ)
  @Get('incoming')
  @ApiOperation({
    summary: 'List handovers assigned to me as recipient',
    description:
      'Optionally filter by the date of the schedule each handover was created for, using startDate/endDate (YYYY-MM-DD).',
  })
  findIncomingHandovers(
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.queryBus.execute(
      new GetIncomingHandoversQuery(userId, tenantId, startDate, endDate),
    );
  }

  @Get('schedule/:id')
  @ApiOperation({ summary: 'Get the handover for a given schedule' })
  findByScheduleId(
    @Param('id') scheduleId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.queryBus.execute(
      new GetHandoverByScheduleQuery(scheduleId, tenantId),
    );
  }

  @RequirePermissions(Permission.HANDOVERS_READ)
  @Get(':id/entries')
  @ApiOperation({ summary: 'List entries for a handover' })
  findEntries(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.queryBus.execute(new GetHandoverEntriesQuery(id, tenantId));
  }
}
