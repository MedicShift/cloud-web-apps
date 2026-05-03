import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';

@Injectable()
export class DepartmentRepository {
  constructor(
    @InjectRepository(Department)
    private readonly ormRepository: Repository<Department>,
  ) {}

  async createDepartment(data: Partial<Department>): Promise<Department> {
    const department = this.ormRepository.create(data);
    return await this.ormRepository.save(department);
  }

  async findAll(tenantId?: string): Promise<Department[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.ormRepository.find({ where });
  }

  async findOneById(id: string, tenantId: string): Promise<Department> {
    const department = await this.ormRepository.findOne({
      where: { id, tenantId },
    });
    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }
    return department;
  }

  async updateDepartment(
    id: string,
    tenantId: string,
    updateData: Partial<Department>,
  ): Promise<Department> {
    const department = await this.findOneById(id, tenantId);
    this.ormRepository.merge(department, updateData);
    return await this.ormRepository.save(department);
  }

  async deleteDepartment(id: string, tenantId: string): Promise<void> {
    const department = await this.findOneById(id, tenantId);
    await this.ormRepository.remove(department);
  }
}
