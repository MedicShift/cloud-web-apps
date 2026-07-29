import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateShiftDto } from './dtos/create-shift.dto';
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
import { CreateShiftCommand } from './commands/impl/create-shift.command';
import { UpdateShiftCommand } from './commands/impl/update-shift.command';
import { DeleteShiftCommand } from './commands/impl/delete-shift.command';
import { GetShiftQuery } from './queries/impl/get-shift.query';
import { GetShiftsQuery } from './queries/impl/get-shifts.query';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Shifts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'shifts', version: '1' })
export class ShiftsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @RequirePermissions(Permission.SHIFTS_CREATE)
  @Post()
  @ApiOperation({ summary: 'Create a new shift' })
  create(
    @Body() dto: CreateShiftDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new CreateShiftCommand({ ...dto, tenantId }),
    );
  }

  @RequirePermissions(Permission.SHIFTS_READ)
  @Get()
  @ApiOperation({ summary: 'List all shifts' })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetShiftsQuery(tenantId));
  }

  @RequirePermissions(Permission.SHIFTS_READ)
  @Get(':id')
  @ApiOperation({ summary: 'Get a shift by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetShiftQuery(id, tenantId));
  }

  @RequirePermissions(Permission.SHIFTS_UPDATE)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a shift' })
  update(
    @Param('id') id: string,
    @Body() updateDto: Record<string, any>,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new UpdateShiftCommand(id, tenantId, updateDto),
    );
  }

  @RequirePermissions(Permission.SHIFTS_DELETE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shift' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeleteShiftCommand(id, tenantId));
  }
}
