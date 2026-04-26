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
import { CreateHospitalDto } from './dtos/create-hospital.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateHospitalCommand } from './commands/impl/create-hospital.command';
import { UpdateHospitalCommand } from './commands/impl/update-hospital.command';
import { DeleteHospitalCommand } from './commands/impl/delete-hospital.command';
import { GetHospitalQuery } from './queries/impl/get-hospital.query';
import { GetHospitalsQuery } from './queries/impl/get-hospitals.query';

@ApiTags('Hospitals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller({ path: 'hospitals', version: '1' })
export class HospitalsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new hospital' })
  create(@Body() dto: CreateHospitalDto) {
    return this.commandBus.execute(new CreateHospitalCommand(dto));
  }

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List all hospitals' })
  findAll() {
    return this.queryBus.execute(new GetHospitalsQuery());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a hospital by ID' })
  findOne(@Param('id') id: string) {
    return this.queryBus.execute(new GetHospitalQuery(id));
  }

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a hospital' })
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.commandBus.execute(new UpdateHospitalCommand(id, updateDto));
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a hospital' })
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteHospitalCommand(id));
  }
}
