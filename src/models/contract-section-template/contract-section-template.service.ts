import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractSectionTemplate } from './contract-section-template.model';
import { IContractSectionTemplateSeed } from 'src/config/seed-data';
import { Attributes, FindOptions } from 'sequelize';

@Injectable()
export class ContractSectionTemplateService {
  constructor(
    @Inject(
      Constants.Database.DatabaseRepositories.ContractSectionTemplateRepository,
    )
    private contractSectionTemplateRepository: typeof ContractSectionTemplate,
  ) {}

  async findAll(
    options?: FindOptions<Attributes<ContractSectionTemplate>>,
    page: number | null = null,
    limit: number | null = null,
  ) {
    let offset: number | null = null;
    if (page && limit) {
      offset = (page - 1) * limit;
      if (page < 1) page = 1;
    }

    const { count: totalCount, rows: contractSectionTemplates } =
      await this.contractSectionTemplateRepository.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    return {
      totalCount,
      contractSectionTemplates,
    };
  }

  async createFromSeed(
    cst: IContractSectionTemplateSeed,
    order: number,
    contractTemplateId: string | null,
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
