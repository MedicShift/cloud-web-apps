import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { DepartmentsController } from './departments.controller';
import { Department } from './entities/department.entity';
import { DepartmentRepository } from './repositories/department.repository';
import { CreateDepartmentHandler } from './commands/handlers/create-department.handler';
import { UpdateDepartmentHandler } from './commands/handlers/update-department.handler';
import { DeleteDepartmentHandler } from './commands/handlers/delete-department.handler';
import { GetDepartmentHandler } from './queries/handlers/get-department.handler';
import { GetDepartmentsHandler } from './queries/handlers/get-departments.handler';

const CommandHandlers = [
  CreateDepartmentHandler,
  UpdateDepartmentHandler,
  DeleteDepartmentHandler,
];
const QueryHandlers = [GetDepartmentHandler, GetDepartmentsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Department]), CqrsModule],
  controllers: [DepartmentsController],
  providers: [DepartmentRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [DepartmentRepository],
})
export class DepartmentsModule {}
