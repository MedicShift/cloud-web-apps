import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { HandoverRepository } from './repositories/handover.repository';
import { HandoverController } from './handover.controller';
import { Handover } from './entities/handover.entity';
import { UpsertHandoverHandler } from './commands/handlers/upsert-handover.handler';
import { GetHandoverHandler } from './queries/handlers/get-handover.handler';
import { GetHandoversHandler } from './queries/handlers/get-handovers.handler';
import { GetMyHandoverHandler } from './queries/handlers/get-my-handover.handler';

const CommandHandlers = [UpsertHandoverHandler];
const QueryHandlers = [
  GetHandoverHandler,
  GetHandoversHandler,
  GetMyHandoverHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([Handover]), CqrsModule],
  controllers: [HandoverController],
  providers: [HandoverRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [HandoverRepository],
})
export class HandoverModule {}
