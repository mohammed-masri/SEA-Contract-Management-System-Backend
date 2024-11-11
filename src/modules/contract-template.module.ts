import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { contractTemplateProviders } from 'src/models/contract-template/contract-template.provider';
import { ContractTemplateService } from 'src/models/contract-template/contract-template.service';
import { ContractSectionTemplateModuleDependencies } from './contract-section-template.module';

export const ContractTemplateModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    ContractTemplateService,
    ...contractTemplateProviders,
    ...ContractSectionTemplateModuleDependencies.providers,
  ],
};

@Module({
  imports: [...ContractTemplateModuleDependencies.imports],
  providers: [...ContractTemplateModuleDependencies.providers],
})
export class ContractTemplateModule {}
