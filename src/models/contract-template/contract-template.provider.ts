import { Constants } from 'src/config';
import { ContractTemplate } from './contract-template.model';

export const contractTemplateProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.ContractTemplateRepository,
    useValue: ContractTemplate,
  },
];
