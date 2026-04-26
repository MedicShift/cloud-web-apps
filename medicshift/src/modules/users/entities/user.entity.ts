import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @Column({ select: false }) // Don't return password by default
  password?: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty({ enum: UserRole, default: UserRole.NURSE })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NURSE,
  })
  role: UserRole;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: true }) // nullable for initial admin
  hospitalId: string;

  // --- Enterprise Security Fields ---

  @Column({ type: 'varchar', nullable: true, select: false })
  hashedRefreshToken?: string | null;

  @Column({ type: 'int', default: 0 })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true })
  lockedUntil?: Date | null;
}
