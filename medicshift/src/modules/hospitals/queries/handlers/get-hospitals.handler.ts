import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHospitalsQuery } from '../impl/get-hospitals.query';
import { HospitalRepository } from '../../repositories/hospital.repository';
import { Hospital } from '../../entities/hospital.entity';

@QueryHandler(GetHospitalsQuery)
export class GetHospitalsHandler implements IQueryHandler<GetHospitalsQuery> {
  constructor(private readonly hospitalRepository: HospitalRepository) {}

  async execute(_query: GetHospitalsQuery): Promise<Hospital[]> {
    return this.hospitalRepository.findAll();
  }
}
