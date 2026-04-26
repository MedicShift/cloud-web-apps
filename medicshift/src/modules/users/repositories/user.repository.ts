import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findAll(hospitalId?: string): Promise<User[]> {
    const where = hospitalId ? { hospitalId } : {};
    return await this.ormRepository.find({ where });
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.ormRepository.findOne({ where: { id } });
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
        'password',
        'firstName',
        'lastName',
        'role',
        'hospitalId',
        'failedLoginAttempts',
        'lockedUntil',
        'hashedRefreshToken',
      ],
    });
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    const user = await this.findOneById(id);
    this.ormRepository.merge(user, updateData);
    return await this.ormRepository.save(user);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.findOneById(id);
    await this.ormRepository.remove(user);
  }

  async saveUser(user: User): Promise<User> {
    return await this.ormRepository.save(user);
  }
}
