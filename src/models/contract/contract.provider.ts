import { Constants } from 'src/config';
import { Contract } from './contract.model';

export const contractProviders = [
  {
    provide: Constants.Database.DatabaseRepositories.ContractRepository,
    useValue: Contract,
  },
];
