import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsPhoneNumber,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ArrayDataResponse } from 'src/common/global.dto';
import { UserResponse } from 'src/models/user/user.dto';

import { StringUtils } from 'src/utils';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The email of the user, must be unique and case-insensitive',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @Transform(({ value }) => StringUtils.normalizeString(value))
  email: string;

  @ApiProperty({
    description: 'The phone number of the user in a valid format',
    example: '+1234567890',
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: 'Password for the user account (min length: 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'The birth date of the user in ISO format',
    example: '2000-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: Date;
}

export class UserArrayDataResponse extends ArrayDataResponse<UserResponse> {
  @ApiProperty({ type: UserResponse, isArray: true })
  data: UserResponse[];
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Password for the user account (min length: 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The email of the user, must be unique and case-insensitive',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @Transform(({ value }) => StringUtils.normalizeString(value))
  email: string;

  @ApiProperty({
    description: 'The phone number of the user in a valid format',
    example: '+1234567890',
  })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    description: 'The birth date of the user in ISO format',
    example: '2000-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: Date;
}
