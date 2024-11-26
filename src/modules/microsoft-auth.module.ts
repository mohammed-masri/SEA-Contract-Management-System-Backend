import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MicrosoftAuthService } from 'src/models/microsoft-auth/microsoft-auth.service';
import { ServerConfigService } from 'src/models/server-config/server-config.service';

export const MicrosoftAuthModuleDependencies = {
  imports: [],
  providers: [MicrosoftAuthService, ServerConfigService, JwtService],
};

@Module({
  imports: [...MicrosoftAuthModuleDependencies.imports],
  providers: [...MicrosoftAuthModuleDependencies.providers],
})
export class MicrosoftAuthModule {}
