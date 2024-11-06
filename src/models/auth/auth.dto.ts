import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from '../user/user.dto';

export class LoginResponse {
  @ApiProperty()
  accessToken: string;
  @ApiProperty({ type: UserResponse })
  user: UserResponse;

  constructor(accessToken: string, user: UserResponse) {
    this.accessToken = accessToken;
    this.user = user;
  }
}
