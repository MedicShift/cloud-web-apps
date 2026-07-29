import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UpsertHandoverDto } from './dtos/upsert-handover.dto';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetHandoversQuery } from './queries/impl/get-handovers.query';
import { GetHandoverQuery } from './queries/impl/get-handover.query';
import { UpsertHandoverCommand } from './commands/impl/upsert-handover.command';
import { GetHandoverEntriesQuery } from '../handover-entries/queries/impl/get-handover-entries.query';
import { GetMyHandoverQuery } from './queries/impl/get-my-handover.query';

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
      'Upserts by (tenantId, scheduleId) — one handover per schedule. If a handover already exists for that schedule, it is updated in place (including reassigning the author or re-submitting/signing a draft) instead of creating a duplicate.',
  })
  upsert(
    @Body() dto: UpsertHandoverDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new UpsertHandoverCommand(
        tenantId,
        dto.scheduleId,
        dto.authorId,
        dto.entries,
        dto.recipientId,
        dto.status,
        dto.submittedAt,
      ),
    );
  }

  @Roles(UserRole.USER, UserRole.MANAGER)
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
  @Get(':id')
  @ApiOperation({ summary: 'Get an handover by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetHandoverQuery(id, tenantId));
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
