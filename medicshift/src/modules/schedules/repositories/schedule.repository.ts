import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, InsertResult } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { ScheduleStatus } from '../enums/schedule-status.enum';

export interface GeneratedShiftAssignment {
  userId: string;
  shiftId: string;
}

export type GeneratedScheduleDays = Record<string, GeneratedShiftAssignment[]>;

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
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule #${id} not found`);
    }
    return schedule;
  }

  async updateSchedule(
    id: string,
    tenantId: string,
    updateData: Partial<Schedule>,
  ): Promise<Schedule> {
    const schedule = await this.findOneById(id, tenantId);
    this.ormRepository.merge(schedule, updateData);
    return await this.ormRepository.save(schedule);
  }

  async deleteSchedule(id: string, tenantId: string): Promise<void> {
    const schedule = await this.findOneById(id, tenantId);
    await this.ormRepository.remove(schedule);
  }

  async saveSchedules(
    tenantId: string,
    res: GeneratedScheduleDays,
  ): Promise<InsertResult> {
    const schedules = Object.entries(res).flatMap(([date, shifts]) =>
      shifts.map((shift) => ({
        userId: shift.userId,
        shiftId: shift.shiftId,
        date: new Date(date),
        status: ScheduleStatus.DRAFT,
        tenantId,
      })),
    );

    return await this.ormRepository.manager
      .createQueryBuilder()
      .insert()
      .into(Schedule)
      .values(schedules)
      .execute();
  }

  async findByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
    tenantId?: string,
    departmentId?: string,
  ): Promise<Schedule[]> {
    const qb = this.ormRepository
      .createQueryBuilder('schedule')
      .innerJoin('schedule.user', 'user')
      .innerJoinAndSelect('schedule.shift', 'shift')
      .where('schedule.userId = :userId', { userId })
      .andWhere('schedule.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (tenantId) {
      qb.andWhere('schedule.tenantId = :tenantId', { tenantId });
    }
    if (departmentId) {
      qb.andWhere('user.departmentId = :departmentId', { departmentId });
    }

    return qb.getMany();
  }

  async findByDepartmentAndDateRange(
    departmentId: string,
    startDate: Date,
    endDate: Date,
    tenantId?: string,
  ): Promise<Schedule[]> {
    const qb = this.ormRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.user', 'user')
      .leftJoinAndSelect('schedule.shift', 'shift')
      .where('user.departmentId = :departmentId', { departmentId })
      .andWhere('schedule.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (tenantId) {
      qb.andWhere('schedule.tenantId = :tenantId', { tenantId });
    }

    return qb.getMany();
  }
}
