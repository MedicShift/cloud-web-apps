import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateHospitalCommand } from '../impl/update-hospital.command';
import { HospitalRepository } from '../../repositories/hospital.repository';
import { Hospital } from '../../entities/hospital.entity';

@CommandHandler(UpdateHospitalCommand)
export class UpdateHospitalHandler implements ICommandHandler<UpdateHospitalCommand> {
  constructor(private readonly hospitalRepository: HospitalRepository) {}

  async execute(command: UpdateHospitalCommand): Promise<Hospital> {
    return this.hospitalRepository.updateHospital(
      command.id,
      command.updateData,
    );
  }
}
