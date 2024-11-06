import { Constants } from 'src/config';
import { Participant } from './participant.model';

export const participantProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.ParticipantRepository,
    useValue: Participant,
  },
];
