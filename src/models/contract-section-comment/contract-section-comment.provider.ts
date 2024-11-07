import { Constants } from 'src/config';
import { ContractSectionComment } from './contract-section-comment.model';

export const contractSectionCommentProviders = [
  {
    provide:
      Constants.Database.DatabaseRepositories.ContractSectionCommentRepository,
    useValue: ContractSectionComment,
  },
];
