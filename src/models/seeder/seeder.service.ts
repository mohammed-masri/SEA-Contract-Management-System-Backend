import { Injectable } from '@nestjs/common';
import { ContractTemplateService } from '../contract-template/contract-template.service';
import { SeedDate } from 'src/config';

@Injectable()
export class SeederService {
  constructor(
    private readonly contractTemplateService: ContractTemplateService,
  ) {}

  async seedContractTemplates() {
    for (let i = 0; i < SeedDate.ContractTemplates.length; i++) {
      const ctd = SeedDate.ContractTemplates[i];
      await this.contractTemplateService.createFromSeed(ctd);
    }
  }
}
