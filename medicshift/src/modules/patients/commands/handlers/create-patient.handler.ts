import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePatientCommand } from '../impl/create-patient.command';
import { PatientRepository } from '../../repositories/patient.repository';
import { Patient } from '../../entities/patient.entity';

@CommandHandler(CreatePatientCommand)
export class CreatePatientHandler implements ICommandHandler<CreatePatientCommand> {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(command: CreatePatientCommand): Promise<Patient> {
    const { mrn, tenantId } =
      command;
    return this.patientRepository.createPatient({
      mrn,
      tenantId
    });
  }
}
