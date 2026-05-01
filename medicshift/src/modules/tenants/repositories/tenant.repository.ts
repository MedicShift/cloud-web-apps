import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class TenantRepository {
  constructor(
    @InjectRepository(Tenant)
    private readonly ormRepository: Repository<Tenant>,
  ) {}

  async createTenant(data: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.ormRepository.create(data);
    return await this.ormRepository.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return await this.ormRepository.find();
  }

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.ormRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant #${id} not found`);
    }
    return tenant;
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findById(id);
    await this.ormRepository.remove(tenant);
  }
}
