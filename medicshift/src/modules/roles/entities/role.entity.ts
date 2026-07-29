import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Permission } from '../../auth/enums/permission.enum';
import { User } from '../../users/entities/user.entity';
import { Invite } from '../../invite/entities/invite.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column()
  name!: string;

  @Column({ type: 'uuid', nullable: true })
  tenantId?: string | null;

  @Column({ default: false })
  isCustom!: boolean;

  @Column({ type: 'simple-array' })
  permissions!: Permission[];

  @OneToMany(() => User, (user: User) => user.role)
  users!: User[];

  @OneToMany(() => Invite, (invite) => invite.role)
  invites!: Invite[];
}
