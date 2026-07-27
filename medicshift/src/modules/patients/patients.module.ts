import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PatientsController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { PatientRepository } from './repositories/patient.repository';
import { CreatePatientHandler } from './commands/handlers/create-patient.handler';
import { DeletePatientHandler } from './commands/handlers/delete-patient.handler';
import { GetPatientsHandler } from './queries/handlers/get-patients.handler';

const CommandHandlers = [CreatePatientHandler, DeletePatientHandler];
const QueryHandlers = [GetPatientsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Patient]), CqrsModule],
  controllers: [PatientsController],
  providers: [PatientRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [PatientRepository],
})
export class PatientsModule {}
