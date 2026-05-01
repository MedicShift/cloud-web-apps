import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from 'src/modules/tenants/entities/tenant.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Shift } from 'src/modules/shifts/entities/shift.entity';

@Entity('departments')
export class Department extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @Column({ type: 'uuid', nullable: true })
  departmentHeadId: string | null;

  @ManyToOne(() => Tenant, (tenant) => tenant.departments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'departmentHeadId' })
  departmentHead: User;

  @OneToMany(() => User, (user) => user.department)
  users: User[];

  @OneToMany(() => Shift, (shift) => shift.department)
  shifts: Shift[];
}
