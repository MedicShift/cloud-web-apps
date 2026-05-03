import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateDepartmentCommand } from '../impl/update-department.command';
import { DepartmentRepository } from '../../repositories/department.repository';
import { Department } from '../../entities/department.entity';

@CommandHandler(UpdateDepartmentCommand)
export class UpdateDepartmentHandler implements ICommandHandler<UpdateDepartmentCommand> {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async execute(command: UpdateDepartmentCommand): Promise<Department> {
    return this.departmentRepository.updateDepartment(
      command.id,
      command.tenantId,
      command.updateData,
    );
  }
}
