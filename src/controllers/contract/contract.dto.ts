import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  MinLength,
  MaxLength,
  IsUUID,
  IsNumber,
  IsPositive,
  IsInt,
  IsOptional,
} from 'class-validator';
import { ArrayDataResponse } from 'src/common/global.dto';
import { ContractShortResponseForUser } from 'src/models/contract/contract.dto';

export class CreateContractDto {
  @ApiProperty({
    description: 'The name of the contract',
    example: 'Contract 1',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'The description of the contract',
    example: 'Contract 1',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The id of the contract template',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsString()
  @IsUUID()
  templateId: string;
}

export class ContractShortArrayDataResponse extends ArrayDataResponse<ContractShortResponseForUser> {
  @ApiProperty({ type: ContractShortResponseForUser, isArray: true })
  data: ContractShortResponseForUser[];
}

export class CreateContractSectionDto {
  @ApiProperty({
    description: 'The title of the section',
    example: 'Terms and Conditions',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the section in HTML format',
    example: '<p>Hello World</p>',
    format: 'html',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The order of the section',
    example: '1',
  })
  @IsNumber()
  @IsPositive()
  @IsInt()
  order: number;

  @ApiProperty({
    description: 'The id of the parent section',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    nullable: true,
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  parentId: string | null;
}

export class UpdateContractSectionDto {
  @ApiProperty({
    description: 'The title of the section',
    example: 'Terms and Conditions',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the section in HTML format',
    example: '<p>Hello World</p>',
    format: 'html',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The order of the section',
    example: '1',
  })
  @IsNumber()
  @IsPositive()
  @IsInt()
  order: number;

  @ApiProperty({
    description: 'The id of the parent section',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    nullable: true,
  })
  @IsString()
  @IsUUID()
  @IsOptional()
  parentId: string | null;
}
