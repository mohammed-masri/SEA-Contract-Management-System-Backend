import { Module } from '@nestjs/common';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

export const ServerConfigModuleDependencies = {
  imports: [],
  providers: [ServerConfigService],
};

@Module({
  imports: [...ServerConfigModuleDependencies.imports],
  providers: [...ServerConfigModuleDependencies.providers],
})
export class ServerConfigModule {}
