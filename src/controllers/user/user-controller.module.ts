import { Module } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from 'src/models/user/user.service';
import { userProviders } from 'src/models/user/user.provider';

@Module({
  controllers: [UserController],
  providers: [UserService, ...userProviders],
})
export class UserControllerModule {}
