import { UseGuards, Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { CreateTenantCommand } from './commands/impl/create-tenant.command';
import { DeleteTenantCommand } from './commands/impl/delete-tenant.command';
import { GetTenantsQuery } from './queries/impl/get-tenants.query';
import { SendInviteCommand } from '../invite/commands/impl/send-invite.command';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  async create(@Body() createTenantDto: CreateTenantDto, @CurrentUser('id') userId: string) {
    const tenant = await this.commandBus.execute(new CreateTenantCommand(createTenantDto));
    await this.commandBus.execute(
      new SendInviteCommand(createTenantDto.adminEmail, tenant.id, userId, UserRole.ADMIN),
    );
    return tenant;
  }

  @Roles(UserRole.ADMIN)
  @Get('all')
  @ApiOperation({ summary: 'List all tenants' })
  findAll() {
    return this.queryBus.execute(new GetTenantsQuery());
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tenant' })
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteTenantCommand(id));
  }
}
