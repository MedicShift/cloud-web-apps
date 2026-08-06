import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between } from 'typeorm';
import { Handover } from '../entities/handover.entity';
import { HandoverEntry } from '../../handover-entries/entities/handover-entry.entity';

@Injectable()
export class HandoverRepository {
  constructor(
    @InjectRepository(Handover)
    private readonly ormRepository: Repository<Handover>,
  ) {}

  async upsertHandoverWithEntries(
    key: { tenantId: string; scheduleId: string },
    handoverData: Partial<Handover>,
    entriesData: Partial<HandoverEntry>[],
  ): Promise<Handover> {
    return this.ormRepository.manager.transaction(async (manager) => {
      let handover = await manager.findOne(Handover, {
        where: key,
        lock: { mode: 'pessimistic_write' },
      });

      if (handover) {
        manager.merge(Handover, handover, handoverData);
      } else {
        handover = manager.create(Handover, { ...key, ...handoverData });
      }
      handover = await manager.save(handover);

      const existingEntries = await manager.find(HandoverEntry, {
        where: { handoverId: handover.id, tenantId: handover.tenantId },
      });
      const existingByEncounter = new Map(
        existingEntries.map((entry) => [entry.encounterId, entry]),
      );
      const incomingEncounterIds = new Set(
        entriesData.map((entry) => entry.encounterId),
      );

      const entriesToSave = entriesData.map((entry) => {
        const existing = existingByEncounter.get(entry.encounterId as string);
        if (existing) {
          return manager.merge(HandoverEntry, existing, entry);
        }
        return manager.create(HandoverEntry, {
          ...entry,
          tenantId: handover.tenantId,
          handoverId: handover.id,
        });
      });

      const entriesToRemove = existingEntries.filter(
        (entry) => !incomingEncounterIds.has(entry.encounterId),
      );
      if (entriesToRemove.length) {
        await manager.remove(HandoverEntry, entriesToRemove);
      }

      handover.entries = await manager.save(HandoverEntry, entriesToSave);

      return handover;
    });
  }

  async findAll(tenantId: string): Promise<Handover[]> {
    if (!tenantId) {
      return [];
    }
    return await this.ormRepository.find({
      where: { tenantId },
    });
  }

  async findMine(
    userId: string,
    tenantId: string,
    startDate: string,
    endDate: string,
  ): Promise<Handover[]> {
    return this.findByParty('authorId', userId, tenantId, startDate, endDate);
  }

  async findIncoming(
    userId: string,
    tenantId: string,
    startDate: string,
    endDate: string,
  ): Promise<Handover[]> {
    return this.findByParty(
      'recipientId',
      userId,
      tenantId,
      startDate,
      endDate,
    );
  }

  private async findByParty(
    field: 'authorId' | 'recipientId',
    userId: string,
    tenantId: string,
    startDate: string,
    endDate: string,
  ): Promise<Handover[]> {
    const where: FindOptionsWhere<Handover> = { [field]: userId, tenantId };
    if (startDate && endDate) {
      where.schedule = {
        date: Between(new Date(startDate), new Date(endDate)),
      };
    }

    return this.ormRepository.find({
      where,
      relations: { author: true, schedule: true, entries: { encounter: { patient: true } } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByScheduleId(
    scheduleId: string,
    tenantId: string,
  ): Promise<Handover | null> {
    return this.ormRepository.findOne({
      where: { scheduleId, tenantId },
      relations: {
        schedule: true,
        entries: { encounter: { patient: true } },
      },
    });
  }

  async findOneById(id: string, tenantId?: string): Promise<Handover> {
    const where: FindOptionsWhere<Handover> = { id };
    if (tenantId) where.tenantId = tenantId;
    const handover = await this.ormRepository.findOne({
      where,
    });
    if (!handover) {
      throw new NotFoundException(`Handover #${id} not found`);
    }
    return handover;
  }

  async save(handover: Handover): Promise<Handover> {
    return this.ormRepository.save(handover);
  }
}
