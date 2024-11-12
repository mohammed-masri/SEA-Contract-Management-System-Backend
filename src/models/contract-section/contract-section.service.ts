import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractSection } from './contract-section.model';
import { ContractSectionTemplate } from '../contract-section-template/contract-section-template.model';
import { ContractSectionTemplateService } from '../contract-section-template/contract-section-template.service';

@Injectable()
export class ContractSectionService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ContractSectionRepository)
    private contractSectionRepository: typeof ContractSection,
    private readonly contractSectionTemplateService: ContractSectionTemplateService,
  ) {}

  async createFromContractSectionTemplate(
    cst: ContractSectionTemplate,
    contractId: string,
    parentId: string | null,
  ) {
    const contractSection = new this.contractSectionRepository({
      title: cst.title,
      content: cst.content,
      order: cst.order,
      contractId,
      parentId,
    });

    const saved = await contractSection.save();

    const { contractSectionTemplates: contractSectionTemplateChildren } =
      await this.contractSectionTemplateService.findAll(
        {
          where: { parentId: cst.id },
        },
        null,
        null,
      );

    for (let i = 0; i < contractSectionTemplateChildren.length; i++) {
      const cst = contractSectionTemplateChildren[i];
      await this.createFromContractSectionTemplate(cst, contractId, saved.id);
    }

    return saved;
  }
}
