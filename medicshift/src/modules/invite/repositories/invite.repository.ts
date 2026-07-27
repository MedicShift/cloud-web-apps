import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from '../entities/invite.entity';
import { InviteStatus } from '../enums/invite-status';

@Injectable()
export class InviteRepository {
  constructor(
    @InjectRepository(Invite)
    private readonly ormRepository: Repository<Invite>,
  ) {}

  async createInvite(data: Partial<Invite>): Promise<Invite> {
    const invite = this.ormRepository.create(data);
    return await this.ormRepository.save(invite);
  }

  async findByEmail(email: string, tenantId: string): Promise<Invite | null> {
    return await this.ormRepository.findOne({ where: { email, tenantId } });
  }

  async save(invite: Invite): Promise<Invite> {
    return await this.ormRepository.save(invite);
  }

  async findPendingByEmail(email: string): Promise<Invite | null> {
    return await this.ormRepository.findOne({
      where: { email, status: InviteStatus.PENDING },
      order: { createdAt: 'DESC' },
    });
  }
}
