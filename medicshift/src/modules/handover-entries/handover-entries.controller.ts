import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '../users/enums/user-role.enum';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateHandoverEntryDto } from './dtos/create-handover-entry.dto';
import { CreateHandoverEntryCommand } from './commands/impl/create-handover-entry.command';
import { GetHandoverEntryQuery } from './queries/impl/get-handover-entry.query';

@ApiTags('Handover Entries')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'handover-entries', version: '1' })
export class HandoverEntriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.USER, UserRole.MANAGER)
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

  @Get(':id')
  @ApiOperation({ summary: 'Get a handover entry by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetHandoverEntryQuery(id, tenantId));
  }

  // @Roles(UserRole.ADMIN, UserRole.MANAGER)
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
