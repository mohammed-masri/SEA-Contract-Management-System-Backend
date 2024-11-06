import { Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

@Module({
  providers: [ServerConfigService, ...databaseProviders],
  exports: [ServerConfigService, ...databaseProviders],
})
export class DatabaseModule {}
