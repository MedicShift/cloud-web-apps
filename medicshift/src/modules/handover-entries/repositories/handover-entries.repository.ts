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

  async assertBelongsToTenant(
    handoverId: string,
    encounterId: string,
    tenantId: string,
  ): Promise<void> {
    const [handover, encounter] = await Promise.all([
      this.ormRepository.manager.findOne(Handover, {
        where: { id: handoverId, tenantId },
      }),
      this.ormRepository.manager.findOne(Encounter, {
        where: { id: encounterId, tenantId },
      }),
    ]);
    if (!handover) {
      throw new NotFoundException(`Handover #${handoverId} not found`);
    }
    if (!encounter) {
      throw new NotFoundException(`Encounter #${encounterId} not found`);
    }
  }

  async createHandoverEntry(
    data: Partial<HandoverEntry>,
  ): Promise<HandoverEntry> {
    try {
      const entry = this.ormRepository.create(data);
      return await this.ormRepository.save(entry);
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err as unknown as { code?: string }).code === UNIQUE_VIOLATION_CODE
      ) {
        throw new ConflictException(
          'An entry for this patient already exists in this handover',
        );
      }
      throw err;
    }
  }

  async findByHandover(
    handoverId: string,
    tenantId: string,
  ): Promise<HandoverEntry[]> {
    return await this.ormRepository.find({
      where: { handoverId, tenantId },
    });
  }

  async findByHandoverAndEncounter(
    handoverId: string,
    encounterId: string,
    tenantId: string,
  ): Promise<HandoverEntry | null> {
    return await this.ormRepository.findOne({
      where: { handoverId, encounterId, tenantId },
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

  async updateHandoverEntry(
    id: string,
    tenantId: string,
    updateData: Partial<HandoverEntry>,
  ): Promise<HandoverEntry> {
    const entry = await this.findOneById(id, tenantId);
    this.ormRepository.merge(entry, updateData);
    return await this.ormRepository.save(entry);
  }
}
