import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPatientsQuery } from '../impl/get-patients.query';
import { PatientRepository } from '../../repositories/patient.repository';
import { Patient } from '../../entities/patient.entity';

@QueryHandler(GetPatientsQuery)
export class GetPatientsHandler implements IQueryHandler<GetPatientsQuery> {
  constructor(private readonly patientRepository: PatientRepository) {}

  async execute(query: GetPatientsQuery): Promise<Patient[]> {
    return this.patientRepository.findAll(query.tenantId);
  }
}
