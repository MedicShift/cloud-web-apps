import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHospitalQuery } from '../impl/get-hospital.query';
import { HospitalRepository } from '../../repositories/hospital.repository';
import { Hospital } from '../../entities/hospital.entity';

@QueryHandler(GetHospitalQuery)
export class GetHospitalHandler implements IQueryHandler<GetHospitalQuery> {
  constructor(private readonly hospitalRepository: HospitalRepository) {}

  async execute(query: GetHospitalQuery): Promise<Hospital> {
    return this.hospitalRepository.findOneById(query.id);
  }
}
