import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CareLogRepository } from './repositories/care-log.repository';
import { CareLogController } from './care-log.controller';
import { CareLog } from './entities/care-log.entity';
import { CreateCareLogHandler } from './commands/handlers/create-care-log.handler';
import { UpdateCareLogHandler } from './commands/handlers/update-care-log.handler';
import { GetCareLogsHandler } from './queries/handlers/get-care-logs.handler';

const CommandHandlers = [CreateCareLogHandler, UpdateCareLogHandler];
const QueryHandlers = [
  GetCareLogsHandler,
];

@Module({
  imports: [TypeOrmModule.forFeature([CareLog]), CqrsModule],
  controllers: [CareLogController],
  providers: [CareLogRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [CareLogRepository],
})
export class CareLogModule {}
