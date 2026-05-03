import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TenantsController } from './tenants.controller';
import { Tenant } from './entities/tenant.entity';
import { TenantRepository } from './repositories/tenant.repository';
import { CreateHospitalHandler } from './commands/handlers/create-tenant.handler';
import { DeleteTenantHandler } from './commands/handlers/delete-tenant.handler';
import { UpdateTenantHandler } from './commands/handlers/update-tenant.handler';
import { GetTenantsHandler } from './queries/handlers/get-tenants.handler';

const CommandHandlers = [
  CreateHospitalHandler,
  DeleteTenantHandler,
  UpdateTenantHandler,
];
const QueryHandlers = [GetTenantsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Tenant]), CqrsModule],
  controllers: [TenantsController],
  providers: [TenantRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [TenantRepository],
})
export class TenantsModule {}
