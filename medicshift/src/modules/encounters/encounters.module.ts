import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { EncountersController } from './encounters.controller';
import { EncountersRepository } from './repositories/encounters.repository';
import { Encounter } from './entities/encounter.entity';
import { CreateEncounterHandler } from './commands/handlers/create-encounter.handler';
import { UpdateEncounterHandler } from './commands/handlers/update-encounter.handler';
import { DeleteEncounterHandler } from './commands/handlers/delete-encounter.handler';
import { GetEncounterHandler } from './queries/handlers/get-encounter.handler';
import { GetEncountersHandler } from './queries/handlers/get-encounters.handler';
import { GetDepartmentEncountersHandler } from './queries/handlers/get-department-encounters.handler';
import { GetMyDepartmentEncountersHandler } from './queries/handlers/get-my-department-encounters.handler';

const CommandHandlers = [
  CreateEncounterHandler,
  UpdateEncounterHandler,
  DeleteEncounterHandler,
];
const QueryHandlers = [
  GetEncounterHandler,
  GetEncountersHandler,
  GetDepartmentEncountersHandler,
  GetMyDepartmentEncountersHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([Encounter]), CqrsModule],
  controllers: [EncountersController],
  providers: [EncountersRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [EncountersRepository],
})
export class EncountersModule {}
