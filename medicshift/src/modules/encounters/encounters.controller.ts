import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '../users/enums/user-role.enum';
import { CreateEncounterDto } from './dtos/create-encounter.dto';
import { UpdateEncounterDto } from './dtos/update-encounter.dto';
import { CreateEncounterCommand } from './commands/impl/create-encounter.command';
import { UpdateEncounterCommand } from './commands/impl/update-encounter.command';
import { DeleteEncounterCommand } from './commands/impl/delete-encounter.command';
import { GetEncounterQuery } from './queries/impl/get-encounter.query';
import { GetEncountersQuery } from './queries/impl/get-encounters.query';
import { GetDepartmentEncountersQuery } from './queries/impl/get-department-encounters.query';
import { GetMyDepartmentEncountersQuery } from './queries/impl/get-my-department-encounters.query';

@ApiTags('Encounters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'encounters', version: '1' })
export class EncountersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  @ApiOperation({ summary: 'Admit a patient / create an encounter' })
  create(
    @Body() dto: CreateEncounterDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new CreateEncounterCommand(
        dto.patientId,
        dto.departmentId,
        dto.encounterType,
        dto.bedNumber,
        dto.status,
        dto.admittedAt,
        dto.dischargedAt,
        tenantId,
      ),
    );
  }

  @Get('all')
  @ApiOperation({ summary: 'List all encounters' })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetEncountersQuery(tenantId));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Get('department/:id')
  @ApiOperation({ summary: 'List encounters in department' })
  findEncountersByDepartment(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.queryBus.execute(new GetDepartmentEncountersQuery(id, tenantId));
  }

  @Roles(UserRole.USER)
  @Get('my-department')
  @ApiOperation({ summary: 'List my department encounters' })
  findMyDepartmentEncounters(
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('departmentId') deptId: string,
  ) {
    return this.queryBus.execute(
      new GetMyDepartmentEncountersQuery(deptId, tenantId),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an encounter by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetEncounterQuery(id, tenantId));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Put(':id')
  @ApiOperation({ summary: 'Update an encounter' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateEncounterDto,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.commandBus.execute(
      new UpdateEncounterCommand(
        id,
        tenantId,
        dto.patientId,
        dto.departmentId,
        dto.encounterType,
        dto.bedNumber,
        dto.status,
        dto.admittedAt,
        dto.dischargedAt,
      ),
    );
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an encounter' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeleteEncounterCommand(id, tenantId));
  }
}
