import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { HandoverEntriesRepository } from './repositories/handover-entries.repository';
import { HandoverEntriesController } from './handover-entries.controller';
import { HandoverEntry } from './entities/handover-entry.entity';
import { GetHandoverEntriesHandler } from './queries/handlers/get-handover-entries.handler';

const CommandHandlers = [
];
const QueryHandlers = [GetHandoverEntriesHandler];

@Module({
  imports: [TypeOrmModule.forFeature([HandoverEntry]), CqrsModule],
  controllers: [HandoverEntriesController],
  providers: [HandoverEntriesRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [HandoverEntriesRepository],
})
export class HandoverEntriesModule {}
