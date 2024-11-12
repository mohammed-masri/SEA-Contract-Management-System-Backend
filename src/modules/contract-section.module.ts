import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { contractSectionProviders } from 'src/models/contract-section/contract-section.provider';
import { ContractSectionService } from 'src/models/contract-section/contract-section.service';
import { ContractSectionTemplateModuleDependencies } from './contract-section-template.module';

export const ContractSectionModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    ContractSectionService,
    ...contractSectionProviders,
    ...ContractSectionTemplateModuleDependencies.providers,
  ],
};

@Module({
  imports: [...ContractSectionModuleDependencies.imports],
  providers: [...ContractSectionModuleDependencies.providers],
})
export class ContractSectionModule {}
