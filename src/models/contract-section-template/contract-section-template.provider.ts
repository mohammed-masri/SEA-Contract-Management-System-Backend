import { Constants } from 'src/config';
import { ContractSectionTemplate } from './contract-section-template.model';

export const contractSectionTemplateProviders = [
  {
    provide:
      Constants.Database.DatabaseRepositories.ContractSectionTemplateRepository,
    useValue: ContractSectionTemplate,
  },
];
