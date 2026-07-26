import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from 'src/modules/tenants/entities/tenant.entity';
import { Patient } from 'src/modules/patients/entities/patient.entity';
import { Department } from 'src/modules/departments/entities/department.entity';
import { EncounterType } from '../enums/encounters.encounterType';
import { EncounterStatus } from '../enums/encounters.status';

@Entity('encounter')
export class Encounter extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  patientId!: string;

  @Column({ type: 'uuid' })
  departmentId!: string;

  @Column({ type: 'simple-enum', enum: EncounterType })
  encounterType!: EncounterType;

  @Column({ type: 'simple-enum', enum: EncounterStatus })
  status!: EncounterStatus;

  @Column()
  bedNumber!: string;

  @Column({ type: 'timestamp' })
  admittedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  dischargedAt!: Date | null;

  @ManyToOne(() => Tenant, (tenant) => tenant.encounters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @ManyToOne(() => Patient, (patient) => patient.encounters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient!: Patient;

  @ManyToOne(() => Department, (department) => department.encounters, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'departmentId' })
  department!: Department;
}
