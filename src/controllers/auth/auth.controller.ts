import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  ChangeMyPasswordDto,
  LoginUserDto,
  RequestOTPDto,
  CheckOTPValidityDto,
  ResetPasswordDto,
  UpdateMyUserDto,
} from './auth.dto';
import { AuthService } from 'src/models/auth/auth.service';
import { LoginResponse } from 'src/models/auth/auth.dto';
import { UserResponse } from 'src/models/user/user.dto';
import { JWTAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthorizedRequest } from 'src/common/global.dto';
import { UserService } from 'src/models/user/user.service';
import { OTPService } from 'src/models/otp/otp.service';
import { Op } from 'sequelize';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly OTPService: OTPService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'User login with email or phone number' })
  @ApiOkResponse({
    description: 'The user has been successfully logged in.',
    type: LoginResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async loginUser(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'fetch logged user details' })
  @ApiOkResponse({
    description: 'the logged user details has been fetched',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async fetchLoggedUserDetails(@Request() req: AuthorizedRequest) {
    const userId = req.context.id;
    const user = await this.userService.checkIsFound({ where: { id: userId } });
    return this.userService.makeUserResponse(user);
  }

  @Put('me')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'update my user details' })
  @ApiOkResponse({
    description: 'my user details has been updated',
    type: UserResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async updateLoggedUserDetails(
    @Request() req: AuthorizedRequest,
    @Body() body: UpdateMyUserDto,
  ) {
    const userId = req.context.id;
    let user = await this.userService.checkIsFound({ where: { id: userId } });
    user = await this.userService.update(user, body);
    return this.userService.makeUserResponse(user);
  }

  @Put('change-password')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'change my password' })
  @ApiOkResponse({
    description: 'the password has been changed successfully',
    type: Boolean,
  })
  @ApiBadRequestResponse({ description: 'Old password is incorrect.' })
  @ApiUnauthorizedResponse({ description: 'Invalid token' })
  async changeMyPassword(
    @Request() req: AuthorizedRequest,
    @Body() body: ChangeMyPasswordDto,
  ) {
    const userId = req.context.id;
    const user = await this.userService.checkIsFound({ where: { id: userId } });

    return await this.userService.changePassword(
      user,
      body.newPassword,
      true,
      body.oldPassword,
    );
  }

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for identifier' })
  @ApiOkResponse({ description: 'OTP sent successfully', type: Boolean })
  async requestOTP(@Body() body: RequestOTPDto) {
    const { email, phoneNumber } = body;
    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    await this.OTPService.createOrUpdate(identifier);

    return true;
  }

  @Post('check-otp-validity')
  @ApiOperation({ summary: 'Verify OTP for identifier' })
  @ApiOkResponse({ description: 'OTP verified successfully', type: Boolean })
  @ApiBadRequestResponse({
    description:
      'There is no otp, reach the limit of tries, otp has been expired, or otp is incorrect',
  })
  async checkOTPValidity(@Body() body: CheckOTPValidityDto) {
    const { email, phoneNumber, OTPCode } = body;
    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    await this.OTPService.checkValidity(identifier, OTPCode);

    return true;
  }

  @Put('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiOkResponse({
    description: 'password has reset successfully',
    type: Boolean,
  })
  @ApiBadRequestResponse({
    description:
      'There is no otp, reach the limit of tries, otp has been expired, or otp is incorrect',
  })
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { email, phoneNumber, OTPCode } = body;
    let identifier: string;

    if (email) {
      identifier = email;
    } else {
      identifier = phoneNumber;
    }

    const otp = await this.OTPService.checkValidity(identifier, OTPCode);
    otp.destroy();

    const user = await this.userService.checkIsFound({
      where: { [Op.or]: { email: identifier, phoneNumber: identifier } },
    });

    await this.userService.changePassword(user, body.newPassword);

    return true;
  }
}
