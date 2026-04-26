import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dtos/create-schedule.dto';
import { ScheduleStatus } from './enums/schedule-status.enum';

@Injectable()
export class SchedulesService {
  private readonly logger = new Logger(SchedulesService.name);

  constructor(
    @InjectRepository(Schedule)
    private schedulesRepository: Repository<Schedule>,
  ) {}

  async create(createDto: CreateScheduleDto): Promise<Schedule> {
    const schedule = this.schedulesRepository.create({ ...createDto });
    return await this.schedulesRepository.save(schedule);
  }

  async findAll(hospitalId?: string): Promise<Schedule[]> {
    const query = hospitalId ? { hospitalId } : {};
    return await this.schedulesRepository.find({ where: query });
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.schedulesRepository.findOne({ 
      where: { id },
      relations: ['entries', 'entries.user', 'entries.shift']
    });
    if (!schedule) {
      throw new NotFoundException(`Schedule #${id} not found`);
    }
    return schedule;
  }

  async remove(id: string): Promise<void> {
    const schedule = await this.findOne(id);
    await this.schedulesRepository.remove(schedule);
  }

  async triggerGeneration(id: string): Promise<Schedule> {
    const schedule = await this.findOne(id);
    schedule.status = ScheduleStatus.GENERATING;
    await this.schedulesRepository.save(schedule);
    
    // Fire off async task to python microservice here
    this.logger.log(`Triggering schedule generation for ${id}`);
    
    return schedule;
  }
}
