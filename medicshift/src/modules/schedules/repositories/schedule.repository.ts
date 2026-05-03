import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly ormRepository: Repository<Schedule>,
  ) {}

  async createSchedule(data: Partial<Schedule>): Promise<Schedule> {
    const schedule = this.ormRepository.create(data);
    return await this.ormRepository.save(schedule);
  }

  async findAll(tenantId?: string): Promise<Schedule[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.ormRepository.find({ where });
  }

  async findOneById(id: string, tenantId?: string): Promise<Schedule> {
    const where: FindOptionsWhere<Schedule> = {
      id,
    };
    if (tenantId) where.tenantId = tenantId;
    const schedule = await this.ormRepository.findOne({
      where,
      relations: ['entries', 'entries.user', 'entries.shift'],
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule #${id} not found`);
    }
    return schedule;
  }

  async deleteSchedule(id: string, tenantId: string): Promise<void> {
    const schedule = await this.findOneById(id, tenantId);
    await this.ormRepository.remove(schedule);
  }

  async saveSchedule(schedule: Schedule): Promise<Schedule> {
    return await this.ormRepository.save(schedule);
  }
}
