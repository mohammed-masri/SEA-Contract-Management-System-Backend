import { Constants } from 'src/config';
import { ContractSectionHistory } from './contract-section-history.model';

export const contractSectionHistoryProviders = [
  {
    provide:
      Constants.Database.DatabaseRepositories.ContractSectionHistoryRepository,
    useValue: ContractSectionHistory,
  },
];
