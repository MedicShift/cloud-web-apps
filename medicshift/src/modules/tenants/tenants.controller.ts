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
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { Permission } from '../auth/enums/permission.enum';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
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
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tenants')
export class TenantsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @RequirePermissions(Permission.TENANTS_CREATE)
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
        undefined, // roleId string
        'Hospital Admin', // roleName string
      ),
    );
    return tenant;
  }

  @RequirePermissions(Permission.TENANTS_READ)
  @Get('all')
  @ApiOperation({ summary: 'List all tenants' })
  findAll() {
    return this.queryBus.execute(new GetTenantsQuery());
  }

  @RequirePermissions(Permission.TENANTS_DELETE)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tenant' })
  remove(@Param('id') id: string) {
    return this.commandBus.execute(new DeleteTenantCommand(id));
  }

  @RequirePermissions(Permission.TENANTS_UPDATE)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a tenant' })
  async update(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto,
    @CurrentUser() user: User,
  ): Promise<Tenant> {
    if (user.tenantId && user.tenantId !== id) {
      throw new ForbiddenException('Managers can only update their own tenant');
    }

    if (user.tenantId) {
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
