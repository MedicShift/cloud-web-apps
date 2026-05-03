import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Shift } from '../entities/shift.entity';

@Injectable()
export class ShiftRepository {
  constructor(
    @InjectRepository(Shift)
    private readonly ormRepository: Repository<Shift>,
  ) {}

  async createShift(data: Partial<Shift>): Promise<Shift> {
    const shift = this.ormRepository.create(data);
    return await this.ormRepository.save(shift);
  }

  async findAll(tenantId?: string): Promise<Shift[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.ormRepository.find({ where });
  }

  async findOneById(id: string, tenantId?: string): Promise<Shift> {
    const where: FindOptionsWhere<Shift> = { id };
    if (tenantId) where.tenantId = tenantId;
    const shift = await this.ormRepository.findOne({ where });
    if (!shift) {
      throw new NotFoundException(`Shift #${id} not found`);
    }
    return shift;
  }

  async updateShift(
    id: string,
    tenantId: string,
    updateData: Partial<Shift>,
  ): Promise<Shift> {
    const shift = await this.findOneById(id, tenantId);
    this.ormRepository.merge(shift, updateData);
    return await this.ormRepository.save(shift);
  }

  async deleteShift(id: string, tenantId: string): Promise<void> {
    const shift = await this.findOneById(id, tenantId);
    await this.ormRepository.remove(shift);
  }
}
