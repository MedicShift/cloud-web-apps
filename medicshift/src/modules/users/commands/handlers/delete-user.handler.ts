import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../impl/delete-user.command';
import { UserRepository } from '../../repositories/user.repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    return this.userRepository.deleteUser(command.id, command.tenantId);
  }
}
