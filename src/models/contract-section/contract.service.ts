import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractSection } from './contract-section.model';

@Injectable()
export class ContractSectionService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ContractSectionRepository)
    private contractSectionRepository: typeof ContractSection,
  ) {}
}
