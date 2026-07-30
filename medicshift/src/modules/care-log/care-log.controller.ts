import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, } from '@nestjs/common';
import { CreateCareLogDto } from './dtos/create-care-log.dto';
import { UpdateCareLogDto } from './dtos/update-care-log.dto';
import { CreateCareLogCommand } from './commands/impl/create-care-log.command';
import { UpdateCareLogCommand } from './commands/impl/update-care-log.command';
import { GetCareLogsQuery } from './queries/impl/get-care-logs.query';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { DeleteCareLogCommand } from './commands/impl/delete-care-log.command';

@ApiTags('Care Log')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'care-log', version: '1' })
export class CareLogController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @RequirePermissions(Permission.CARELOG_CREATE)
  @Post()
  @ApiOperation({ summary: 'Create a care log entry for a patient' })
  create(
    @Body() dto: CreateCareLogDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new CreateCareLogCommand(
        tenantId,
        dto.handoverEntryId,
        dto.encounterId,
        dto.category,
        dto.description,
        dto.scheduledAt,
        dto.recordedAt,
        dto.status,
      ),
    );
  }

  @RequirePermissions(Permission.CARELOG_UPDATE)
  @Put(':id')
  @ApiOperation({ summary: 'Update a care log entry' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCareLogDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new UpdateCareLogCommand(
        id,
        tenantId,
        dto.handoverEntryId,
        dto.encounterId,
        dto.category,
        dto.description,
        dto.status,
        dto.scheduledAt,
        dto.recordedAt,
      ),
    );
  }

  @RequirePermissions(Permission.CARELOG_READ)
  @Get('handover-entry/:handoverEntryId')
  @ApiOperation({ summary: 'List care log entries for a handover entry' })
  findByHandoverEntry(
    @Param('handoverEntryId') handoverEntryId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.queryBus.execute(
      new GetCareLogsQuery(handoverEntryId, tenantId),
    );
  }

  @RequirePermissions(Permission.CARELOG_DELETE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient' })
  deleteCareLog(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(new DeleteCareLogCommand(id, tenantId));
  }
}
