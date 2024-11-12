import { Constants } from 'src/config';
import { ContractSection } from './contract-section.model';
import { ApiProperty } from '@nestjs/swagger';

export class ContractSectionResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  content: string;
  @ApiProperty({ type: Number })
  order: number;
  @ApiProperty({ enum: Constants.Contract.ContractSectionStatuses })
  overallStatus: Constants.Contract.ContractSectionStatuses;
  @ApiProperty({ type: ContractSectionResponse, isArray: true })
  subSections: ContractSectionResponse[];
  @ApiProperty({ format: 'date' })
  createdAt: string;
  @ApiProperty({ format: 'date' })
  updatedAt: string;

  constructor(
    contractSection: ContractSection,
    subSections: ContractSectionResponse[],
  ) {
    this.id = contractSection.id;
    this.title = contractSection.title;
    this.content = contractSection.content;
    this.order = contractSection.order;
    this.overallStatus = contractSection.overallStatus;
    this.subSections = subSections;
    this.createdAt = contractSection.createdAt;
    this.updatedAt = contractSection.updatedAt;
  }
}
