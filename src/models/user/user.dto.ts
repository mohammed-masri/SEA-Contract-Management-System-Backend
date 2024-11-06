import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.model';

export class UserResponse {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  birthDate: Date;
  @ApiProperty({ type: Boolean })
  isLocked: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.phoneNumber = user.phoneNumber;
    this.birthDate = user.birthDate;
    this.isLocked = user.isLocked;
  }
}
