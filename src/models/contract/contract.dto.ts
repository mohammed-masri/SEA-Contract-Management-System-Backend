import { ApiProperty } from '@nestjs/swagger';
import { Contract } from './contract.model';
import { Constants } from 'src/config';

export class ContractShortResponse {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ enum: Constants.Contract.ContractStatuses })
  status: Constants.Contract.ContractStatuses;
  @ApiProperty({ format: 'date' })
  createdAt: string;
  @ApiProperty({ format: 'date' })
  updatedAt: string;

  constructor(contract: Contract) {
    this.id = contract.id;
    this.name = contract.name;
    this.description = contract.description;
    this.status = contract.status;
    this.createdAt = contract.createdAt;
    this.updatedAt = contract.updatedAt;
  }
}

export class ContractFullResponse extends ContractShortResponse {
  constructor(contract: Contract) {
    super(contract);
  }
}
