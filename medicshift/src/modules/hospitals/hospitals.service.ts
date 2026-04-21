import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from './entities/hospital.entity';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalsRepository: Repository<Hospital>,
  ) {}

  async create(createDto: any): Promise<Hospital> {
    const hospital = this.hospitalsRepository.create(createDto as import('typeorm').DeepPartial<Hospital>);
    return await this.hospitalsRepository.save(hospital);
  }

  async findAll(): Promise<Hospital[]> {
    return await this.hospitalsRepository.find();
  }

  async findOne(id: string): Promise<Hospital> {
    const hospital = await this.hospitalsRepository.findOne({ where: { id } });
    if (!hospital) {
      throw new NotFoundException(`Hospital #${id} not found`);
    }
    return hospital;
  }

  async update(id: string, updateDto: any): Promise<Hospital> {
    const hospital = await this.findOne(id);
    this.hospitalsRepository.merge(hospital, updateDto);
    return await this.hospitalsRepository.save(hospital);
  }

  async remove(id: string): Promise<void> {
    const hospital = await this.findOne(id);
    await this.hospitalsRepository.remove(hospital);
  }
}
