import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractTemplate } from './contract-template.model';
import { ContractSectionTemplateService } from '../contract-section-template/contract-section-template.service';
import { IContractTemplateSeed } from 'src/config/seed-data';

@Injectable()
export class ContractTemplateService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ContractTemplateRepository)
    private contractTemplateRepository: typeof ContractTemplate,
    private readonly contractSectionTemplateService: ContractSectionTemplateService,
  ) {}

  async createFromSeed(ct: IContractTemplateSeed) {
    const contractTemplate = new this.contractTemplateRepository({
      name: ct.name,
      description: ct.description,
    });

    const saved = await contractTemplate.save();

    for (let i = 0; i < ct.sections.length; i++) {
      const cst = ct.sections[i];
      await this.contractSectionTemplateService.createFromSeed(
        cst,
        i + 1,
        saved.id,
        null,
      );
    }
  }
}
