import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto as import('typeorm').DeepPartial<User>);
    return await this.usersRepository.save(user);
  }

  async findAll(tenantId?: string): Promise<User[]> {
    const query = tenantId ? { tenantId } : {};
    return await this.usersRepository.find({ where: query });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'passwordHash', 'firstName', 'lastName', 'role', 'tenantId'] 
    });
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    const user = await this.findOne(id);
    this.usersRepository.merge(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}
