import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { Encounter } from '../../encounters/entities/encounter.entity';

@Injectable()
export class PatientRepository {
  constructor(
    @InjectRepository(Patient)
    private readonly ormRepository: Repository<Patient>,
  ) {}

  async createPatient(data: Partial<Patient>): Promise<Patient> {
    const patient = this.ormRepository.create(data);
    return await this.ormRepository.save(patient);
  }

  async findAll(tenantId?: string): Promise<Patient[]> {
    const where = tenantId ? { tenantId } : {};
    return await this.ormRepository.find({
      where
    });
  }

  async findOneById(id: string, tenantId?: string): Promise<Patient> {
    const where: FindOptionsWhere<Patient> = { id };
    if (tenantId) where.tenantId = tenantId;
    const patient = await this.ormRepository.findOne({ where });
    if (!patient) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return patient;
  }

  async deletePatient(id: string, tenantId: string): Promise<void> {
    const patient = await this.findOneById(id, tenantId);
    await this.ormRepository.remove(patient);
  }
}
