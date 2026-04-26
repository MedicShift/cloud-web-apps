import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteDepartmentCommand } from '../impl/delete-department.command';
import { DepartmentRepository } from '../../repositories/department.repository';

@CommandHandler(DeleteDepartmentCommand)
export class DeleteDepartmentHandler implements ICommandHandler<DeleteDepartmentCommand> {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  async execute(command: DeleteDepartmentCommand): Promise<void> {
    return this.departmentRepository.deleteDepartment(command.id);
  }
}
