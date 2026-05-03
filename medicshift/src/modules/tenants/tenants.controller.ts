import {
  UseGuards,
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  ForbiddenException,
} from '@nestjs/common';
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
import { UpdateTenantCommand } from './commands/impl/update-tenant.command';
import { GetTenantsQuery } from './queries/impl/get-tenants.query';
import { SendInviteCommand } from '../invite/commands/impl/send-invite.command';
import { UpdateTenantDto } from './dtos/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';
import { User } from '../users/entities/user.entity';

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
  async create(
    @Body() createTenantDto: CreateTenantDto,
    @CurrentUser('id') userId: string,
  ): Promise<Tenant> {
    const tenant: Tenant = await this.commandBus.execute(
      new CreateTenantCommand(createTenantDto),
    );
    await this.commandBus.execute(
      new SendInviteCommand(
        createTenantDto.adminEmail,
        tenant.id,
        userId,
        UserRole.ADMIN,
      ),
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

  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a tenant' })
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
    @CurrentUser() user: User,
  ): Promise<Tenant> {
    if (user.role === UserRole.MANAGER && user.tenantId !== id) {
      throw new ForbiddenException('Managers can only update their own tenant');
    }

    if (user.role === UserRole.MANAGER) {
      if (
        updateTenantDto.plan !== undefined ||
        updateTenantDto.isActive !== undefined
      ) {
        delete updateTenantDto.plan;
        delete updateTenantDto.isActive;

        if (Object.keys(updateTenantDto).length === 0) {
          throw new ForbiddenException(
            'You do not have permission to update plan or status',
          );
        }
      }
    }

    return this.commandBus.execute(
      new UpdateTenantCommand(id, updateTenantDto),
    );
  }
}
