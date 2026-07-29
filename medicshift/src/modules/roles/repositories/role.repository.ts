import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async findByNameAndTenant(
    name: string,
    tenantId?: string,
  ): Promise<Role | null> {
    const query = this.createQueryBuilder('role').where('role.name = :name', {
      name,
    });

    if (tenantId) {
      query.andWhere('(role.tenantId = :tenantId OR role.tenantId IS NULL)', {
        tenantId,
      });
    } else {
      query.andWhere('role.tenantId IS NULL');
    }

    return query.getOne();
  }
}
