import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Encounter } from '../entities/encounter.entity';
import { EncounterStatus } from '../enums/encounters.status';

@Injectable()
export class EncountersRepository {
  constructor(
    @InjectRepository(Encounter)
    private readonly ormRepository: Repository<Encounter>,
  ) {}

  async createEncounter(data: Partial<Encounter>): Promise<Encounter> {
    const encounter = this.ormRepository.create(data);
    return await this.ormRepository.save(encounter);
  }

  async findAll(tenantId: string): Promise<Encounter[]> {
    if (!tenantId) {
      return [];
    }
    return await this.ormRepository.find({
      where: { tenantId },
      relations: ['patient', 'department'],
    });
  }

  async findByDepartmentId(
    departmentId: string,
    tenantId: string,
  ): Promise<Encounter[]> {
    if (!departmentId || !tenantId) {
      return [];
    }
    return await this.ormRepository.find({
      where: { departmentId, tenantId, status: EncounterStatus.ADMITTED },
      relations: ['patient', 'department'],
    });
  }

  async findOneById(id: string, tenantId?: string): Promise<Encounter> {
    const where: FindOptionsWhere<Encounter> = { id };
    if (tenantId) where.tenantId = tenantId;
    const encounter = await this.ormRepository.findOne({
      where,
      relations: ['patient', 'department'],
    });
    if (!encounter) {
      throw new NotFoundException(`Encounter #${id} not found`);
    }
    return encounter;
  }

  async updateEncounter(
    id: string,
    tenantId: string,
    updateData: Partial<Encounter>,
  ): Promise<Encounter> {
    const encounter = await this.findOneById(id, tenantId);
    this.ormRepository.merge(encounter, updateData);
    return await this.ormRepository.save(encounter);
  }

  async deleteEncounter(id: string, tenantId: string): Promise<void> {
    const encounter = await this.findOneById(id, tenantId);
    await this.ormRepository.remove(encounter);
  }
}
