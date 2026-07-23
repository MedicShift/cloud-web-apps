import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteEncounterCommand } from '../impl/delete-encounter.command';
import { EncountersRepository } from '../../repositories/encounters.repository';

@CommandHandler(DeleteEncounterCommand)
export class DeleteEncounterHandler implements ICommandHandler<DeleteEncounterCommand> {
  constructor(private readonly encountersRepository: EncountersRepository) {}

  async execute(command: DeleteEncounterCommand): Promise<void> {
    return this.encountersRepository.deleteEncounter(
      command.id,
      command.tenantId,
    );
  }
}
