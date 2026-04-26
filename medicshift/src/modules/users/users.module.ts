import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { UpdateUserHandler } from './commands/handlers/update-user.handler';
import { DeleteUserHandler } from './commands/handlers/delete-user.handler';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { GetUsersHandler } from './queries/handlers/get-users.handler';
import { GetUserByEmailHandler } from './queries/handlers/get-user-by-email.handler';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];
const QueryHandlers = [GetUserHandler, GetUsersHandler, GetUserByEmailHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  controllers: [UsersController],
  providers: [UserRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [UserRepository, CqrsModule],
})
export class UsersModule {}
