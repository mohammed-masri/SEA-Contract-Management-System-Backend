import { Module } from '@nestjs/common';

import { ContractController } from './contract.controller';

import { AuthModuleDependencies } from 'src/modules/auth.module';
import { ContractModuleDependencies } from 'src/modules/contract.module';

@Module({
  controllers: [ContractController],
  providers: [
    ...ContractModuleDependencies.providers,
    ...AuthModuleDependencies.providers,
  ],
})
export class ContractControllerModule {}
