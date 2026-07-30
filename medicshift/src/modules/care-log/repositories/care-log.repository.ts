import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CareLog } from '../entities/care-log.entity';

@Injectable()
export class CareLogRepository {
  constructor(
    @InjectRepository(CareLog)
    private readonly ormRepository: Repository<CareLog>,
  ) {}

  async createCareLog(data: Partial<CareLog>): Promise<CareLog> {
    const careLog = this.ormRepository.create(data);
    return this.ormRepository.save(careLog);
  }

  async findByHandoverEntry(
    handoverEntryId: string,
    tenantId: string,
  ): Promise<CareLog[]> {
    return this.ormRepository.find({
      where: { handoverEntryId, tenantId },
      order: { createdAt: 'ASC' },
    });
  }

  async findByEncounter(
    encounterId: string,
    tenantId: string,
  ): Promise<CareLog[]> {
    return this.ormRepository.find({
      where: { encounterId, tenantId },
      order: { createdAt: 'ASC' },
    });
  }

  async findOneById(id: string, tenantId?: string): Promise<CareLog> {
    const where: FindOptionsWhere<CareLog> = { id };
    if (tenantId) where.tenantId = tenantId;
    const careLog = await this.ormRepository.findOne({ where });
    if (!careLog) {
      throw new NotFoundException(`Care log #${id} not found`);
    }
    return careLog;
  }

  async updateCareLog(
    id: string,
    tenantId: string,
    updateData: Partial<CareLog>,
  ): Promise<CareLog> {
    const careLog = await this.findOneById(id, tenantId);
    this.ormRepository.merge(careLog, updateData);
    return this.ormRepository.save(careLog);
  }

  async deleteCareLog(id: string, tenantId: string): Promise<void> {
    const careLog = await this.findOneById(id, tenantId);
    await this.ormRepository.remove(careLog);
  }
}
