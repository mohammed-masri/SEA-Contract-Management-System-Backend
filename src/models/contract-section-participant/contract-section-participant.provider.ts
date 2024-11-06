import { Constants } from 'src/config';
import { ContractSectionParticipant } from './contract-section-participant.model';

export const contractSectionParticipantProviders = [
  {
    provide:
      Constants.Database.DatabaseRepositories
        .ContractSectionParticipantRepository,
    useValue: ContractSectionParticipant,
  },
];
