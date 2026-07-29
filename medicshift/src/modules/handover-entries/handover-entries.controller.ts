import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateHandoverEntryDto } from './dtos/create-handover-entry.dto';
import { CreateHandoverEntryCommand } from './commands/impl/create-handover-entry.command';
import { GetHandoverEntryQuery } from './queries/impl/get-handover-entry.query';

@ApiTags('Handover Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'handover-entries', version: '1' })
export class HandoverEntriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @RequirePermissions(Permission.HANDOVERS_CREATE)
  @Post()
  @ApiOperation({ summary: 'Create a handover entry for a patient' })
  create(
    @Body() dto: CreateHandoverEntryDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new CreateHandoverEntryCommand(
        tenantId,
        dto.handoverId,
        dto.encounterId,
        dto.situation,
        dto.background,
        dto.assessment,
        dto.recommendation,
      ),
    );
  }

  @RequirePermissions(Permission.HANDOVERS_READ)
  @Get(':id')
  @ApiOperation({ summary: 'Get a handover entry by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetHandoverEntryQuery(id, tenantId));
  }

  // @RequirePermissions(Permission.HANDOVERS_UPDATE)
  // @Put(':id')
  // @ApiOperation({ summary: 'Update a handover entry' })
  // update(
  //   @Param('id') id: string,
  //   @Body() dto: UpdateHandoverEntryDto,
  //   @CurrentUser('tenantId') tenantId: string,
  // ) {
  //   return this.commandBus.execute(
  //     new UpdateHandoverEntryCommand(
  //       id,
  //       tenantId,
  //       dto.handoverId,
  //       dto.encounterId,
  //       dto.situation,
  //       dto.background,
  //       dto.assessment,
  //       dto.recommendation,
  //     ),
  //   );
  // }
}
