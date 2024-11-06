import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { ContractSectionParticipant } from 'src/models/contract-section-participant/contract-section-participant.model';
import { ContractSection } from 'src/models/contract-section/contract-section.model';
import { Contract } from 'src/models/contract/contract.model';
import { OTP } from 'src/models/otp/otp.model';
import { Participant } from 'src/models/participant/participant.model';
import { User } from 'src/models/user/user.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      const ConnectionConfig = {
        host: configService.get<string>('DATABASE_HOST'),
        port: +configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
      };
      const sequelize = new Sequelize({
        dialect: 'mysql',
        ...ConnectionConfig,
      });
      sequelize.addModels([
        User,
        OTP,
        Contract,
        ContractSection,
        Participant,
        ContractSectionParticipant,
      ]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
