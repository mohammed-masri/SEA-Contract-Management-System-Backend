import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { contractTemplateProviders } from 'src/models/contract-template/contract-template.provider';
import { ContractTemplateService } from 'src/models/contract-template/contract-template.service';

export const ContractTemplateModuleDependencies = {
  imports: [DatabaseModule],
  providers: [ContractTemplateService, ...contractTemplateProviders],
};

@Module({
  imports: [...ContractTemplateModuleDependencies.imports],
  providers: [...ContractTemplateModuleDependencies.providers],
})
export class ContractTemplateModule {}
