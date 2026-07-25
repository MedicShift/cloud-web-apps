import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateEncounterCommand } from '../impl/create-encounter.command';
import { EncountersRepository } from '../../repositories/encounters.repository';
import { Encounter } from '../../entities/encounter.entity';
import { EncounterStatus } from '../../enums/encounters.status';

@CommandHandler(CreateEncounterCommand)
export class CreateEncounterHandler implements ICommandHandler<CreateEncounterCommand> {
  constructor(private readonly encountersRepository: EncountersRepository) {}

  async execute(command: CreateEncounterCommand): Promise<Encounter> {
    const {
      patientId,
      departmentId,
      encounterType,
      bedNumber,
      status,
      admittedAt,
      dischargedAt,
      tenantId,
    } = command;

    return this.encountersRepository.createEncounter({
      patientId,
      departmentId,
      encounterType,
      bedNumber,
      status: status ?? EncounterStatus.ADMITTED,
      admittedAt: new Date(admittedAt),
      dischargedAt: dischargedAt ? new Date(dischargedAt) : null,
      tenantId,
    });
  }
}
