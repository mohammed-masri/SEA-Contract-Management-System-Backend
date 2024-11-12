import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractTemplate } from './contract-template.model';
import { ContractSectionTemplateService } from '../contract-section-template/contract-section-template.service';
import { IContractTemplateSeed } from 'src/config/seed-data';
import { Attributes, FindOptions } from 'sequelize';

@Injectable()
export class ContractTemplateService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ContractTemplateRepository)
    private contractTemplateRepository: typeof ContractTemplate,
    private readonly contractSectionTemplateService: ContractSectionTemplateService,
  ) {}

  async findOne(options?: FindOptions<Attributes<ContractTemplate>>) {
    return await this.contractTemplateRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<ContractTemplate>>) {
    const contractTemplate = await this.findOne(options);
    if (!contractTemplate)
      throw new NotFoundException(`Contract Template not found!`);

    return contractTemplate;
  }

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
