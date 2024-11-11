import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractSectionTemplate } from './contract-section-template.model';
import { IContractSectionTemplateSeed } from 'src/config/seed-data';

@Injectable()
export class ContractSectionTemplateService {
  constructor(
    @Inject(
      Constants.Database.DatabaseRepositories.ContractSectionTemplateRepository,
    )
    private contractSectionTemplateRepository: typeof ContractSectionTemplate,
  ) {}

  async createFromSeed(
    cst: IContractSectionTemplateSeed,
    order: number,
    contractTemplateId: string,
    parent: ContractSectionTemplate | null,
  ) {
    const contractSectionTemplate = new this.contractSectionTemplateRepository({
      title: cst.title,
      content: cst.content,
      order: order,
      contractTemplateId,
      parentId: parent ? parent.id : null,
    });

    const saved = await contractSectionTemplate.save();

    for (let i = 0; i < cst.sections.length; i++) {
      const cstc = cst.sections[i];
      await this.createFromSeed(cstc, i + 1, contractTemplateId, saved);
    }

    return;
  }
}
