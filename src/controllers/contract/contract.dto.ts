import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsUUID } from 'class-validator';
import { ArrayDataResponse } from 'src/common/global.dto';
import { ContractShortResponse } from 'src/models/contract/contract.dto';

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

export class ContractShortArrayDataResponse extends ArrayDataResponse<ContractShortResponse> {
  @ApiProperty({ type: ContractShortResponse, isArray: true })
  data: ContractShortResponse[];
}
