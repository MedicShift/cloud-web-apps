import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateHospitalCommand } from '../impl/create-hospital.command';
import { HospitalRepository } from '../../repositories/hospital.repository';
import { Hospital } from '../../entities/hospital.entity';

@CommandHandler(CreateHospitalCommand)
export class CreateHospitalHandler implements ICommandHandler<CreateHospitalCommand> {
  constructor(private readonly hospitalRepository: HospitalRepository) {}

  async execute(command: CreateHospitalCommand): Promise<Hospital> {
    return this.hospitalRepository.createHospital(command.data);
  }
}
