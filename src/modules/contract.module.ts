import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ContractService } from 'src/models/contract/contract.service';
import { contractProviders } from 'src/models/contract/contract.provider';
import { ContractTemplateModuleDependencies } from './contract-template.module';
import { ContractSectionModuleDependencies } from './contract-section.module';
import { ParticipantModuleDependencies } from './participant.module';

export const ContractModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    ContractService,
    ...contractProviders,
    ...ContractTemplateModuleDependencies.providers,
    ...ContractSectionModuleDependencies.providers,
    ...ParticipantModuleDependencies.providers,
  ],
};

@Module({
  imports: [...ContractModuleDependencies.imports],
  providers: [...ContractModuleDependencies.providers],
})
export class ContractModule {}
