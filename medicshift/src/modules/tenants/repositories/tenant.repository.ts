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

  async findAll(tenantId?: string): Promise<Tenant[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.ormRepository.find({ where });
  }


}
