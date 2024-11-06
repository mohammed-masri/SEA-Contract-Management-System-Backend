import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import { ContractSection } from 'src/models/contract-section/contract-section.model';
import { Contract } from 'src/models/contract/contract.model';
import { OTP } from 'src/models/otp/otp.model';
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
      sequelize.addModels([User, OTP, Contract, ContractSection]);
      await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
