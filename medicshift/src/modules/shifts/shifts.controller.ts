import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateShiftDto } from './dtos/create-shift.dto';
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
import { CreateShiftCommand } from './commands/impl/create-shift.command';
import { UpdateShiftCommand } from './commands/impl/update-shift.command';
import { DeleteShiftCommand } from './commands/impl/delete-shift.command';
import { GetShiftQuery } from './queries/impl/get-shift.query';
import { GetShiftsQuery } from './queries/impl/get-shifts.query';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Shifts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'shifts', version: '1' })
export class ShiftsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  @ApiOperation({ summary: 'Create a new shift' })
  create(@Body() dto: CreateShiftDto, @CurrentUser('tenantId') tenantId: string,) {
    return this.commandBus.execute(
      new CreateShiftCommand({ ...dto, tenantId }),
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all shifts' })
  @ApiQuery({ name: 'tenantId', required: false, type: String })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetShiftsQuery(tenantId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shift by ID' })
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetShiftQuery(id));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a shift' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.commandBus.execute(new UpdateShiftCommand(id, updateDto));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shift' })
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteShiftCommand(id));
  }
}
