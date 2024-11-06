import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { LoginUserDto } from 'src/controllers/auth/auth.dto';
import { BcryptUtils } from 'src/utils';
import { JWTConfig } from 'src/config';
import { LoginResponse } from './auth.dto';
import { UserResponse } from '../user/user.dto';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(data: LoginUserDto) {
    const { email, phoneNumber, password } = data;

    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    const user = await this.userService.findOne({
      where: { [Op.or]: { email: identifier, phoneNumber: identifier } },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isCorrect = await BcryptUtils.comparePassword(
      password,
      user?.password,
    );

    if (!isCorrect) throw new UnauthorizedException('Invalid credentials');

    if (user.isLocked)
      throw new UnauthorizedException('The user has been locked!');

    const token = this.jwtService.sign(
      { id: user.id },
      {
        secret: JWTConfig.JWT_SECRET,
        ...JWTConfig.JWT_OPTIONS,
      },
    );

    return this.makeLoginResponse(
      token,
      this.userService.makeUserResponse(user),
    );
  }

  makeLoginResponse(accessToken: string, user: UserResponse) {
    return new LoginResponse(accessToken, user);
  }
}
