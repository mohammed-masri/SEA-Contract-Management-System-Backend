import { ApiProperty } from '@nestjs/swagger';
import { Contract } from './contract.model';
import { Constants } from 'src/config';
import { ContractSectionResponse } from '../contract-section/contract-section.dto';

export class ContractShortResponseForUser {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty({ enum: Constants.Contract.ContractStatuses })
  status: Constants.Contract.ContractStatuses;
  @ApiProperty({ enum: Constants.Participant.ParticipantRoles })
  role: Constants.Participant.ParticipantRoles;
  @ApiProperty({ format: 'date' })
  createdAt: string;
  @ApiProperty({ format: 'date' })
  updatedAt: string;

  constructor(
    contract: Contract,
    role: Constants.Participant.ParticipantRoles,
  ) {
    this.id = contract.id;
    this.name = contract.name;
    this.description = contract.description;
    this.status = contract.status;
    this.role = role;
    this.createdAt = contract.createdAt;
    this.updatedAt = contract.updatedAt;
  }
}

export class ContractFullResponseForUser extends ContractShortResponseForUser {
  @ApiProperty({ type: ContractSectionResponse, isArray: true })
  sections: ContractSectionResponse[];

  constructor(
    contract: Contract,
    role: Constants.Participant.ParticipantRoles,
    sections: ContractSectionResponse[],
  ) {
    super(contract, role);
    this.sections = sections;
  }
}
