import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { contractSectionHistoryProviders } from 'src/models/contract-section-history/contract-section-history.provider';
import { ContractSectionHistoryService } from 'src/models/contract-section-history/contract-section-history.service';

export const ContractSectionHistoryModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    ContractSectionHistoryService,
    ...contractSectionHistoryProviders,
  ],
};

@Module({
  imports: [...ContractSectionHistoryModuleDependencies.imports],
  providers: [...ContractSectionHistoryModuleDependencies.providers],
})
export class ContractSectionHistoryModule {}
