import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ContractService } from 'src/models/contract/contract.service';
import { contractProviders } from 'src/models/contract/contract.provider';

export const ContractModuleDependencies = {
  imports: [DatabaseModule],
  providers: [ContractService, ...contractProviders],
};

@Module({
  imports: [...ContractModuleDependencies.imports],
  providers: [...ContractModuleDependencies.providers],
})
export class ContractModule {}
