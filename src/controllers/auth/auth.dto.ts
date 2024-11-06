import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MinLength,
  IsPhoneNumber,
  IsEmail,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { IsOneOf } from 'src/decorators/is-one-of.decorator';
import { NotSameAs } from 'src/decorators/not-same-as.decorator';
import { PhoneNumberUtils, StringUtils } from 'src/utils';

export class LoginUserDto {
  @ApiPropertyOptional({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @Transform(({ value }) => StringUtils.normalizeString(value))
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user in international format',
    example: '+1234567890',
  })
  @IsOptional()
  @Transform(({ value }) => PhoneNumberUtils.normalizePhoneNumber(value))
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOneOf(['email', 'phoneNumber'], {
    message:
      'You must provide either an email or a phone number, but not both.',
  })
  identifier?: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ChangeMyPasswordDto {
  @ApiProperty({
    description: 'Password for the user account (min length: 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @ApiProperty({
    description: 'Password for the user account (min length: 8 characters)',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @NotSameAs('oldPassword', {
    message: 'New password must not be the same as old password',
  })
  newPassword: string;
}

export class RequestOTPDto {
  @ApiPropertyOptional({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @Transform(({ value }) => StringUtils.normalizeString(value))
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user in international format',
    example: '+1234567890',
  })
  @IsOptional()
  @Transform(({ value }) => PhoneNumberUtils.normalizePhoneNumber(value))
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOneOf(['email', 'phoneNumber'], {
    message:
      'You must provide either an email or a phone number, but not both.',
  })
  identifier?: string;
}

export class CheckOTPValidityDto {
  @ApiPropertyOptional({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @Transform(({ value }) => StringUtils.normalizeString(value))
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user in international format',
    example: '+1234567890',
  })
  @IsOptional()
  @Transform(({ value }) => PhoneNumberUtils.normalizePhoneNumber(value))
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOneOf(['email', 'phoneNumber'], {
    message:
      'You must provide either an email or a phone number, but not both.',
  })
  identifier?: string;

  @ApiProperty()
  @IsString()
  OTPCode: string;
}

export class ResetPasswordDto {
  @ApiPropertyOptional({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @Transform(({ value }) => StringUtils.normalizeString(value))
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'The phone number of the user in international format',
    example: '+1234567890',
  })
  @IsOptional()
  @Transform(({ value }) => PhoneNumberUtils.normalizePhoneNumber(value))
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOneOf(['email', 'phoneNumber'], {
    message:
      'You must provide either an email or a phone number, but not both.',
  })
  identifier?: string;

  @ApiProperty()
  @IsString()
  OTPCode: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

export class UpdateMyUserDto {
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
    description: 'The birth date of the user in ISO format',
    example: '2000-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  birthDate?: Date;
}
