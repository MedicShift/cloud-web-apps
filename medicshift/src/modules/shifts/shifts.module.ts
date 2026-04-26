import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ShiftsController } from './shifts.controller';
import { Shift } from './entities/shift.entity';
import { ShiftRepository } from './repositories/shift.repository';
import { CreateShiftHandler } from './commands/handlers/create-shift.handler';
import { UpdateShiftHandler } from './commands/handlers/update-shift.handler';
import { DeleteShiftHandler } from './commands/handlers/delete-shift.handler';
import { GetShiftHandler } from './queries/handlers/get-shift.handler';
import { GetShiftsHandler } from './queries/handlers/get-shifts.handler';

const CommandHandlers = [
  CreateShiftHandler,
  UpdateShiftHandler,
  DeleteShiftHandler,
];
const QueryHandlers = [GetShiftHandler, GetShiftsHandler];

@Module({
  imports: [TypeOrmModule.forFeature([Shift]), CqrsModule],
  controllers: [ShiftsController],
  providers: [ShiftRepository, ...CommandHandlers, ...QueryHandlers],
  exports: [ShiftRepository],
})
export class ShiftsModule {}
