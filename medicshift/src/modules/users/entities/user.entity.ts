import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Role } from '../../roles/entities/role.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Department } from '../../departments/entities/department.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  tenantId!: string;

  @Column({ type: 'uuid', nullable: true })
  departmentId!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ select: false }) // Don't return password by default
  passwordHash?: string;

  @Column({ type: 'uuid', nullable: true })
  roleId!: string;

  @ManyToOne(() => Role, (role: Role) => role.users, { onDelete: 'SET NULL' })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt!: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.users, { onDelete: 'CASCADE' })
  tenant!: Tenant;

  @ManyToOne(() => Department, (department) => department.users, {
    onDelete: 'SET NULL',
  })
  department!: Department;

  @Column({ type: 'varchar', nullable: true, select: false })
  hashedRefreshToken?: string | null;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempts!: number;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil?: Date | null;
}
