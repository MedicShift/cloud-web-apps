import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '../users/enums/user-role.enum';
import { UpsertHandoverDto } from './dtos/upsert-handover.dto';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetHandoversQuery } from './queries/impl/get-handovers.query';
import { GetHandoverQuery } from './queries/impl/get-handover.query';
import { UpsertHandoverCommand } from './commands/impl/upsert-handover.command';
import { GetHandoverEntriesQuery } from '../handover-entries/queries/impl/get-handover-entries.query';
import { GetMyHandoverQuery } from './queries/impl/get-my-handover.query';

@ApiTags('Handovers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'handover', version: '1' })
export class HandoverController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.USER, UserRole.MANAGER)
  @Post()
  @ApiOperation({
    summary: 'Create or update a handover',
    description:
      'Upserts by (tenantId, scheduleId, authorId). If a handover already exists for that schedule and author, it is updated in place (including re-submitting/signing a draft) instead of creating a duplicate.',
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

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get('all')
  @ApiOperation({ summary: 'List all handovers' })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetHandoversQuery(tenantId));
  }

  @Get('mine')
  @ApiOperation({ summary: 'List my handovers' })
  findMyHandovers(
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.queryBus.execute(new GetMyHandoverQuery(userId, tenantId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an handover by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetHandoverQuery(id, tenantId));
  }

  @Get(':id/entries')
  @ApiOperation({ summary: 'List entries for a handover' })
  findEntries(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.queryBus.execute(new GetHandoverEntriesQuery(id, tenantId));
  }
}
