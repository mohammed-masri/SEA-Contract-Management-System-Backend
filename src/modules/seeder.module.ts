import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

import { SeederService } from 'src/models/seeder/seeder.service';
import { ContractTemplateModuleDependencies } from './contract-template.module';

export const SeederModuleDependencies = {
  imports: [DatabaseModule],
  providers: [SeederService, ...ContractTemplateModuleDependencies.providers],
};

@Module({
  imports: [...SeederModuleDependencies.imports],
  providers: [...SeederModuleDependencies.providers],
})
export class SeederModule {}
