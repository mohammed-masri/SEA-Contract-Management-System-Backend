import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractSectionHistory } from './contract-section-history.model';

@Injectable()
export class ContractSectionHistoryService {
  constructor(
    @Inject(
      Constants.Database.DatabaseRepositories.ContractSectionHistoryRepository,
    )
    private contractSectionHistoryRepository: typeof ContractSectionHistory,
  ) {}
}
