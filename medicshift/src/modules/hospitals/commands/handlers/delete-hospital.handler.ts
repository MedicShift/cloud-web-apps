import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteHospitalCommand } from '../impl/delete-hospital.command';
import { HospitalRepository } from '../../repositories/hospital.repository';

@CommandHandler(DeleteHospitalCommand)
export class DeleteHospitalHandler implements ICommandHandler<DeleteHospitalCommand> {
  constructor(private readonly hospitalRepository: HospitalRepository) {}

  async execute(command: DeleteHospitalCommand): Promise<void> {
    return this.hospitalRepository.deleteHospital(command.id);
  }
}
