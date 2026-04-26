import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { HospitalsController } from './hospitals.controller';
import { Hospital } from './entities/hospital.entity';
import { HospitalRepository } from './repositories/hospital.repository';
import { CreateHospitalHandler } from './commands/handlers/create-hospital.handler';
import { UpdateHospitalHandler } from './commands/handlers/update-hospital.handler';
import { DeleteHospitalHandler } from './commands/handlers/delete-hospital.handler';
import { GetHospitalHandler } from './queries/handlers/get-hospital.handler';
import { GetHospitalsHandler } from './queries/handlers/get-hospitals.handler';

const CommandHandlers = [
  CreateHospitalHandler,
  UpdateHospitalHandler,
  DeleteHospitalHandler,
];
const QueryHandlers = [GetHospitalHandler, GetHospitalsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Hospital]), CqrsModule],
  controllers: [HospitalsController],
  providers: [HospitalRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [HospitalRepository],
})
export class HospitalsModule {}
