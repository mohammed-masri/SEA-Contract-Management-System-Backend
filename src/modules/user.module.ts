import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { userProviders } from 'src/models/user/user.provider';
import { UserService } from 'src/models/user/user.service';

export const UserModuleDependencies = {
  imports: [DatabaseModule],
  providers: [UserService, ...userProviders],
};

@Module({
  imports: [...UserModuleDependencies.imports],
  providers: [...UserModuleDependencies.providers],
})
export class UserModule {}
