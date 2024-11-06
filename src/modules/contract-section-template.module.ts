import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { contractSectionTemplateProviders } from 'src/models/contract-section-template/contract-section-template.provider';
import { ContractSectionTemplateService } from 'src/models/contract-section-template/contract-section-template.service';

export const ContractSectionTemplateModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    ContractSectionTemplateService,
    ...contractSectionTemplateProviders,
  ],
};

@Module({
  imports: [...ContractSectionTemplateModuleDependencies.imports],
  providers: [...ContractSectionTemplateModuleDependencies.providers],
})
export class ContractSectionTemplateModule {}
