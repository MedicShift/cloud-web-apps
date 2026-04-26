import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
  ) {}

  async create(createDto: any, hospitalId: string): Promise<Department> {
    console.log('hospital', hospitalId)
    const department = this.departmentsRepository.create({...createDto, hospitalId} as import('typeorm').DeepPartial<Department>);
    return await this.departmentsRepository.save(department);
  }

  async findAll(hospitalId?: string): Promise<Department[]> {
    const query = hospitalId ? { hospitalId } : {};
    return await this.departmentsRepository.find({ where: query });
  }

  async findOne(id: string): Promise<Department> {
    const department = await this.departmentsRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department #${id} not found`);
    }
    return department;
  }

  async update(id: string, updateDto: any): Promise<Department> {
    const department = await this.findOne(id);
    this.departmentsRepository.merge(department, updateDto);
    return await this.departmentsRepository.save(department);
  }

  async remove(id: string): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentsRepository.remove(department);
  }
}
