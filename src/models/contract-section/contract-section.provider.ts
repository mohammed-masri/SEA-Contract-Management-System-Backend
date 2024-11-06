import { Constants } from 'src/config';
import { ContractSection } from './contract-section.model';

export const contractSectionProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.ContractSectionRepository,
    useValue: ContractSection,
  },
];
