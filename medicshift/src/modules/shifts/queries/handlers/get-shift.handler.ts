import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetShiftQuery } from '../impl/get-shift.query';
import { ShiftRepository } from '../../repositories/shift.repository';
import { Shift } from '../../entities/shift.entity';

@QueryHandler(GetShiftQuery)
export class GetShiftHandler implements IQueryHandler<GetShiftQuery> {
  constructor(private readonly shiftRepository: ShiftRepository) {}

  async execute(query: GetShiftQuery): Promise<Shift> {
    return this.shiftRepository.findOneById(query.id);
  }
}
