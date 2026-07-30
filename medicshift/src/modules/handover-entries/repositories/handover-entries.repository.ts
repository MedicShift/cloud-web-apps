import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, FindOptionsWhere } from 'typeorm';
import { HandoverEntry } from '../entities/handover-entry.entity';
import { Handover } from '../../handover/entities/handover.entity';
import { Encounter } from '../../encounters/entities/encounter.entity';

const UNIQUE_VIOLATION_CODE = '23505';

@Injectable()
export class HandoverEntriesRepository {
  constructor(
    @InjectRepository(HandoverEntry)
    private readonly ormRepository: Repository<HandoverEntry>,
  ) {}

  async findByHandover(
    handoverId: string,
    tenantId: string,
  ): Promise<HandoverEntry[]> {
    return await this.ormRepository.find({
      where: { handoverId, tenantId },
    });
  }


  async findOneById(id: string, tenantId?: string): Promise<HandoverEntry> {
    const where: FindOptionsWhere<HandoverEntry> = { id };
    if (tenantId) where.tenantId = tenantId;
    const entry = await this.ormRepository.findOne({ where });
    if (!entry) {
      throw new NotFoundException(`Handover entry #${id} not found`);
    }
    return entry;
  }

}
