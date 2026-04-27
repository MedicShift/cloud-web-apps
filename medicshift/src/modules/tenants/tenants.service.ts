import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {
    constructor(
        @InjectRepository(Tenant)
        private tenantsRepository: Repository<Tenant>,
    ) { }

    async create(createDto: any): Promise<Tenant> {
        const tenant = this.tenantsRepository.create(createDto as import('typeorm').DeepPartial<Tenant>);
        return await this.tenantsRepository.save(tenant);
    }

    async findAll(): Promise<Tenant[]> {
        return await this.tenantsRepository.find();
    }

    async findOne(id: string): Promise<Tenant> {
        const hospital = await this.tenantsRepository.findOne({ where: { id } });
        if (!hospital) {
            throw new NotFoundException(`Hospital #${id} not found`);
        }
        return hospital;
    }

    async remove(id: string): Promise<void> {
        const hospital = await this.findOne(id);
        await this.tenantsRepository.remove(hospital);
    }
}
