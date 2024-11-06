import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { Participant } from './participant.model';

@Injectable()
export class ParticipantService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ParticipantRepository)
    private participantRepository: typeof Participant,
  ) {}
}
