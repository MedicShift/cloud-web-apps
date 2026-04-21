import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shift } from './entities/shift.entity';
import { CreateShiftDto } from './dtos/create-shift.dto';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private shiftsRepository: Repository<Shift>,
  ) {}

  async create(createDto: CreateShiftDto): Promise<Shift> {
    const shift = this.shiftsRepository.create({ ...createDto });
    return await this.shiftsRepository.save(shift);
  }

  async findAll(hospitalId?: string): Promise<Shift[]> {
    const query = hospitalId ? { hospitalId } : {};
    return await this.shiftsRepository.find({ where: query });
  }

  async findOne(id: string): Promise<Shift> {
    const shift = await this.shiftsRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException(`Shift #${id} not found`);
    }
    return shift;
  }

  async update(id: string, updateDto: any): Promise<Shift> {
    const shift = await this.findOne(id);
    this.shiftsRepository.merge(shift, updateDto);
    return await this.shiftsRepository.save(shift);
  }

  async remove(id: string): Promise<void> {
    const shift = await this.findOne(id);
    await this.shiftsRepository.remove(shift);
  }
}
