import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>,
  ) {}

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.ormRepository.create(data);
    return await this.ormRepository.save(user);
  }

  async findAll(tenantId?: string): Promise<User[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.ormRepository.find({ where });
  }

  async findOneById(id: string, tenantId?: string): Promise<User> {
    const where: FindOptionsWhere<User> = { id };
    if (tenantId) where.tenantId = tenantId;
    const user = await this.ormRepository.findOne({ where });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.ormRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'passwordHash',
        'firstName',
        'lastName',
        'role',
        'tenantId',
        'failedLoginAttempts',
        'lockedUntil',
        'hashedRefreshToken',
      ],
    });
  }

  async updateUser(
    id: string,
    tenantId: string,
    updateData: Partial<User>,
  ): Promise<User> {
    const user = await this.findOneById(id, tenantId);
    this.ormRepository.merge(user, updateData);
    return await this.ormRepository.save(user);
  }

  async deleteUser(id: string, tenantId: string): Promise<void> {
    const user = await this.findOneById(id, tenantId);
    await this.ormRepository.remove(user);
  }

  async saveUser(user: User): Promise<User> {
    return await this.ormRepository.save(user);
  }
}
