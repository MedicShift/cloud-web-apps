import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { UserRepository } from '../../repositories/user.repository';
import { User } from '../../entities/user.entity';
import { UserRole } from '../../enums/user-role.enum';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { email, password, firstName, lastName, role, hospitalId } = command;
    return this.userRepository.createUser({
      email,
      password,
      firstName,
      lastName,
      role: role as UserRole,
      hospitalId,
    });
  }
}
