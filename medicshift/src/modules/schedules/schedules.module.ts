import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { SchedulesController } from './schedules.controller';
import { Schedule } from './entities/schedule.entity';
import { ScheduleRepository } from './repositories/schedule.repository';
import { CreateScheduleHandler } from './commands/handlers/create-schedule.handler';
import { DeleteScheduleHandler } from './commands/handlers/delete-schedule.handler';
import { UpdateScheduleHandler } from './commands/handlers/update-schedule.handler';
import { TriggerScheduleGenerationHandler } from './commands/handlers/trigger-schedule-generation.handler';
import { GetScheduleHandler } from './queries/handlers/get-schedule.handler';
import { GetSchedulesHandler } from './queries/handlers/get-schedules.handler';
import { DepartmentsModule } from '../departments/departments.module';
import { GetUserSchedulesHandler } from './queries/handlers/get-user-schedules.handler';
import { GetDepartmentSchedulesHandler } from './queries/handlers/get-department-schedules.handler';

const CommandHandlers = [
  CreateScheduleHandler,
  UpdateScheduleHandler,
  DeleteScheduleHandler,
  TriggerScheduleGenerationHandler,
];
const QueryHandlers = [
  GetScheduleHandler,
  GetSchedulesHandler,
  GetUserSchedulesHandler,
  GetDepartmentSchedulesHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), CqrsModule, DepartmentsModule],
  controllers: [SchedulesController],
  providers: [ScheduleRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [ScheduleRepository],
})
export class SchedulesModule {}
