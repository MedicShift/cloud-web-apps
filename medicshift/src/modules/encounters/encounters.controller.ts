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
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
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
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller({ path: 'encounters', version: '1' })
export class EncountersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @RequirePermissions(Permission.ENCOUNTERS_CREATE)
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

  @RequirePermissions(Permission.ENCOUNTERS_READ)
  @Get('all')
  @ApiOperation({ summary: 'List all encounters' })
  findAll(@CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetEncountersQuery(tenantId));
  }

  @RequirePermissions(Permission.ENCOUNTERS_READ)
  @Get('department/:id')
  @ApiOperation({ summary: 'List encounters in department' })
  findEncountersByDepartment(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.queryBus.execute(
      new GetDepartmentEncountersQuery(id, tenantId),
    );
  }

  @RequirePermissions(Permission.ENCOUNTERS_READ)
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

  @RequirePermissions(Permission.ENCOUNTERS_READ)
  @Get(':id')
  @ApiOperation({ summary: 'Get an encounter by ID' })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.queryBus.execute(new GetEncounterQuery(id, tenantId));
  }

  @RequirePermissions(Permission.ENCOUNTERS_UPDATE)
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

  @RequirePermissions(Permission.ENCOUNTERS_DELETE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an encounter' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.commandBus.execute(new DeleteEncounterCommand(id, tenantId));
  }
}
