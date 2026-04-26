import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDepartmentQuery } from '../impl/get-department.query';
import { DepartmentRepository } from '../../repositories/department.repository';
import { Department } from '../../entities/department.entity';

@QueryHandler(GetDepartmentQuery)
export class GetDepartmentHandler implements IQueryHandler<GetDepartmentQuery> {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async execute(query: GetDepartmentQuery): Promise<Department> {
    return this.departmentRepository.findOneById(query.id);
  }
}
