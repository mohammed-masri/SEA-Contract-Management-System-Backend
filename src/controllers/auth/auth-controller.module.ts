import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthModuleDependencies } from 'src/modules/auth.module';
import { OTPModuleDependencies } from 'src/modules/otp.module';

@Module({
  controllers: [AuthController],
  providers: [
    ...AuthModuleDependencies.providers,
    ...OTPModuleDependencies.providers,
  ],
})
export class AuthControllerModule {}
