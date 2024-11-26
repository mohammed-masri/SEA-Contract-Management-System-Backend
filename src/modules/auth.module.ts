import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/models/auth/auth.service';
import { UserModuleDependencies } from './user.module';
import { MicrosoftAuthModuleDependencies } from './microsoft-auth.module';

export const AuthModuleDependencies = {
  imports: [],
  providers: [
    AuthService,
    JwtService,
    ...UserModuleDependencies.providers,
    ...MicrosoftAuthModuleDependencies.providers,
  ],
};

@Module({
  imports: [...AuthModuleDependencies.imports],
  providers: [...AuthModuleDependencies.providers],
})
export class AuthModule {}
