import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from '../entities/hospital.entity';

@Injectable()
export class HospitalRepository {
  constructor(
    @InjectRepository(Hospital)
    private readonly ormRepository: Repository<Hospital>,
  ) {}

  async createHospital(data: Partial<Hospital>): Promise<Hospital> {
    const hospital = this.ormRepository.create(data);
    return await this.ormRepository.save(hospital);
  }

  async findAll(): Promise<Hospital[]> {
    return await this.ormRepository.find();
  }

  async findOneById(id: string): Promise<Hospital> {
    const hospital = await this.ormRepository.findOne({ where: { id } });
    if (!hospital) {
      throw new NotFoundException(`Hospital #${id} not found`);
    }
    return hospital;
  }

  async updateHospital(
    id: string,
    updateData: Partial<Hospital>,
  ): Promise<Hospital> {
    const hospital = await this.findOneById(id);
    this.ormRepository.merge(hospital, updateData);
    return await this.ormRepository.save(hospital);
  }

  async deleteHospital(id: string): Promise<void> {
    const hospital = await this.findOneById(id);
    await this.ormRepository.remove(hospital);
  }
}
