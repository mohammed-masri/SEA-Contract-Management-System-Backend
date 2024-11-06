import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user.module';
import { UserControllerModule } from './controllers/user/user-controller.module';
import { AuthControllerModule } from './controllers/auth/auth-controller.module';
import { AuthModule } from './modules/auth.module';
import { OTPModule } from './modules/otp.module';
import { ConfigModule } from '@nestjs/config';
import { ContractModule } from './modules/contract.module';
import { ContractSectionModule } from './modules/contract-section.module';
import { ParticipantModule } from './modules/participant.module';
import { ContractSectionParticipantModule } from './modules/contract-section-participant.module';
import { ContractSectionHistoryModule } from './modules/contract-section-history.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    OTPModule,
    ContractModule,
    ParticipantModule,
    ContractSectionModule,
    ContractSectionParticipantModule,
    ContractSectionHistoryModule,
    UserControllerModule,
    AuthControllerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
