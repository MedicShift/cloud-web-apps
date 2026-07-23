import {
  UseGuards,
  Controller,
  Param,
  Delete,
  Post,
  Body, Get,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '../users/enums/user-role.enum';
import { DeletePatientCommand } from './commands/impl/delete-patient.command';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { CreatePatientCommand } from './commands/impl/create-patient.command';
  import { GetPatientsQuery } from './queries/impl/get-patients.query';

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'patients', version: '1' })
export class PatientsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  @ApiOperation({ summary: 'add patient' })
  create(
    @Body() dto: CreatePatientDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(new CreatePatientCommand(dto.mrn, tenantId));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a patient' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeletePatientCommand(id, tenantId));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get('all')
  @ApiOperation({ summary: 'List all patients' })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetPatientsQuery(tenantId));
  }
}
