import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateDepartmentCommand } from '../impl/create-department.command';
import { DepartmentRepository } from '../../repositories/department.repository';
import { Department } from '../../entities/department.entity';

@CommandHandler(CreateDepartmentCommand)
export class CreateDepartmentHandler implements ICommandHandler<CreateDepartmentCommand> {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async execute(command: CreateDepartmentCommand): Promise<Department> {
    const {name, hospitalId} = command;
    return this.departmentRepository.createDepartment({
      name,
      hospitalId
    });
  }
}
