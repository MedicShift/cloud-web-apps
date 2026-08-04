import { Injectable, NotFoundException } from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private readonly ormRepository: Repository<Role>,
  ) {}

  async createCustomRole(data: Partial<Role>): Promise<Role> {
    const role = this.ormRepository.create(data);
    return await this.ormRepository.save(role);
  }

  async findTenantOnly(tenantId: string): Promise<Role[]> {
    if (!tenantId) {
      return [];
    }
    return await this.ormRepository.find({
      where: { tenantId },
    });
  }

  async findByNameAndTenant(
    name: string,
    tenantId?: string,
  ): Promise<Role | null> {
    if (!tenantId) {
      return await this.ormRepository.findOne({
        where: { name, tenantId: IsNull() },
      });
    }

    return await this.ormRepository.findOne({
      where: [
        { name, tenantId },
        { name, tenantId: IsNull() },
      ],
    });
  }

  async findOneById(id: string, tenantId: string): Promise<Role> {
    const role = await this.ormRepository.findOne({
      where: { id, tenantId },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async deleteRole(id: string, tenantId: string): Promise<void> {
    const role = await this.findOneById(id, tenantId);
    await this.ormRepository.remove(role);
  }

  async updateRole(
    id: string,
    tenantId: string,
    updateData: Partial<Role>,
  ): Promise<Role> {
    const role = await this.findOneById(id, tenantId);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    this.ormRepository.merge(role, updateData);
    return this.ormRepository.save(role);
  }
}
