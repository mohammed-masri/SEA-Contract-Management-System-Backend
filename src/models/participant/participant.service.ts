import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { Participant } from './participant.model';

@Injectable()
export class ParticipantService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ParticipantRepository)
    private participantRepository: typeof Participant,
  ) {}

  async create(
    type: Constants.Participant.ParticipantTypes,
    contractId: string,
    role: Constants.Participant.ParticipantRoles,
    user: string | null,
    guestEmail: string | null,
  ) {
    const participant = new this.participantRepository({
      type,
      contractId,
      role,
      user,
      guestEmail,
    });

    return await participant.save();
  }

  async deleteAllForContract(contractId: string) {
    await this.participantRepository.destroy({
      where: { contractId },
      force: true,
    });
  }
}
