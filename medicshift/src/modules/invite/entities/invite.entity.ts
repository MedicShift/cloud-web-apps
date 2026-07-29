import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { Role } from '../../roles/entities/role.entity';
import { InviteStatus } from '../enums/invite-status';
import { User } from '../../users/entities/user.entity';

@Entity('invites')
export class Invite extends BaseEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column()
  email!: string;

  @Column({ type: 'uuid' })
  invitedBy!: string;

  @Column({ type: 'uuid' })
  roleId!: string;

  @ManyToOne(() => Role, (role) => role.invites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role!: Role;

  @Column({ type: 'simple-enum', enum: InviteStatus })
  status!: InviteStatus;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt?: Date;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenantId' })
  tenant!: Tenant;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invitedBy' })
  invitedByUser!: User;
}
