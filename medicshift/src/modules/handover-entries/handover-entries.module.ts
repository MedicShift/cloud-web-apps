import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { HandoverEntriesRepository } from './repositories/handover-entries.repository';
import { HandoverEntriesController } from './handover-entries.controller';
import { HandoverEntry } from './entities/handover-entry.entity';
import { CreateHandoverEntryHandler } from './commands/handlers/create-handover-entry.handler';
import { UpdateHandoverEntryHandler } from './commands/handlers/update-handover-entry.handler';
import { GetHandoverEntryHandler } from './queries/handlers/get-handover-entry.handler';
import { GetHandoverEntriesHandler } from './queries/handlers/get-handover-entries.handler';

const CommandHandlers = [CreateHandoverEntryHandler, UpdateHandoverEntryHandler];
const QueryHandlers = [GetHandoverEntryHandler, GetHandoverEntriesHandler];

@Module({
  imports: [TypeOrmModule.forFeature([HandoverEntry]), CqrsModule],
  controllers: [HandoverEntriesController],
  providers: [HandoverEntriesRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [HandoverEntriesRepository],
})
export class HandoverEntriesModule {}
