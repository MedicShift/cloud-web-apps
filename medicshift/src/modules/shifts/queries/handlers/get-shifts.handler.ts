import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetShiftsQuery } from '../impl/get-shifts.query';
import { ShiftRepository } from '../../repositories/shift.repository';
import { Shift } from '../../entities/shift.entity';

@QueryHandler(GetShiftsQuery)
export class GetShiftsHandler implements IQueryHandler<GetShiftsQuery> {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async execute(query: GetShiftsQuery): Promise<Shift[]> {
    return this.shiftRepository.findAll(query.tenantId);
  }
}
