import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { TenantPlan, TenantType } from '../enums/tenants.enum';
import { User } from 'src/modules/users/entities/user.entity';
import { Department } from 'src/modules/departments/entities/department.entity';
import { Shift } from 'src/modules/shifts/entities/shift.entity';

@Entity('tenants')
export class Tenant extends BaseEntity {

  @Column()
  name: string;

  @Column({ type: 'simple-enum', enum: TenantType, default: TenantType.HOSPITAL })
  tenantType: TenantType;

  @Column({ nullable: true })
  adminEmail: string;

  @Column({ nullable: true })
  address: string;

  @ApiProperty()
  @Column({ nullable: true })
  phone: string;

  @Column()
  plan: TenantPlan;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  renewalDate: Date;

  @Column({ default: 0 })
  userCount: number

  @Column('int', { nullable: true })
  openRequests: number;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[]

  @OneToMany(() => Department, (department) => department.tenant)
  departments: Department[]  
  
  @OneToMany(() => Shift, (shift) => shift.tenant)
  shifts: Shift[]
}
