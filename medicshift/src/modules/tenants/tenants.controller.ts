
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { UseGuards, Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { CreateTenantDto } from './dtos/create-tenant.dto';
import { InviteService } from '../invite/invite.service';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tenants')

export class TenantsController {
  constructor(private readonly tenantsService: TenantsService,
    private readonly inviteService: InviteService
  ) { }

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto)
      .then((tenant) => {
        this.inviteService.sendInvite(createTenantDto.adminEmail, tenant.id, UserRole.ADMIN)
      });
  }

  @Roles(UserRole.ADMIN)
  @Get('all')
  @ApiOperation({ summary: 'List all tenants' })
  findAll() {
    return this.tenantsService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tenant' })
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
