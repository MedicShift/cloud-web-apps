import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePatientCommand } from '../impl/delete-patient.command';
import { PatientRepository } from '../../repositories/patient.repository';

@CommandHandler(DeletePatientCommand)
export class DeletePatientHandler implements ICommandHandler<DeletePatientCommand> {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(command: DeletePatientCommand): Promise<void> {
    return this.patientRepository.deletePatient(command.id, command.tenantId);
  }
}
