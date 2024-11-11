import { Module } from '@nestjs/common';

import { SeederController } from './seeder.controller';

import { SeederModuleDependencies } from 'src/modules/seeder.module';

@Module({
  controllers: [SeederController],
  providers: [...SeederModuleDependencies.providers],
})
export class SeederControllerModule {}
