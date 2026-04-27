import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDepartmentsQuery } from '../impl/get-departments.query';
import { DepartmentRepository } from '../../repositories/department.repository';
import { Department } from '../../entities/department.entity';

@QueryHandler(GetDepartmentsQuery)
export class GetDepartmentsHandler implements IQueryHandler<GetDepartmentsQuery> {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async execute(query: GetDepartmentsQuery): Promise<Department[]> {
    return this.departmentRepository.findAll(query.tenantId);
  }
}
