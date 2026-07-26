import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateEncounterCommand } from '../impl/update-encounter.command';
import { EncountersRepository } from '../../repositories/encounters.repository';
import { Encounter } from '../../entities/encounter.entity';

@CommandHandler(UpdateEncounterCommand)
export class UpdateEncounterHandler implements ICommandHandler<UpdateEncounterCommand> {
  constructor(private readonly encountersRepository: EncountersRepository) {}

  async execute(command: UpdateEncounterCommand): Promise<Encounter> {
    const {
      encounterId,
      tenantId,
      patientId,
      departmentId,
      encounterType,
      bedNumber,
      status,
      admittedAt,
      dischargedAt,
    } = command;

    return this.encountersRepository.updateEncounter(encounterId, tenantId, {
      patientId,
      departmentId,
      encounterType,
      bedNumber,
      status,
      admittedAt: new Date(admittedAt),
      dischargedAt: dischargedAt ? new Date(dischargedAt) : null,
    });
  }
}
