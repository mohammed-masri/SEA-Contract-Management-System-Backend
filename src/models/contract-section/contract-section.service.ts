import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractSection } from './contract-section.model';
import { ContractSectionTemplate } from '../contract-section-template/contract-section-template.model';
import { ContractSectionTemplateService } from '../contract-section-template/contract-section-template.service';
import { ContractSectionResponse } from './contract-section.dto';
import { Attributes, FindOptions } from 'sequelize';

@Injectable()
export class ContractSectionService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ContractSectionRepository)
    private contractSectionRepository: typeof ContractSection,
    private readonly contractSectionTemplateService: ContractSectionTemplateService,
  ) {}

  async findAll(
    options?: FindOptions<Attributes<ContractSection>>,
    page: number | null = null,
    limit: number | null = null,
  ) {
    let offset: number | null = null;
    if (page && limit) {
      offset = (page - 1) * limit;
      if (page < 1) page = 1;
    }
    const { count: totalCount, rows: contractSections } =
      await this.contractSectionRepository.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    return {
      totalCount,
      contractSections,
    };
  }

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

  async makeContractSectionResponse(contractSection: ContractSection) {
    const { contractSections: contractSectionSubsections } = await this.findAll(
      {
        where: { parentId: contractSection.id },
        order: [['order', 'ASC']],
      },
    );

    const contractSectionSubsectionsResponse =
      await this.makeContractSectionsResponse(contractSectionSubsections);

    return new ContractSectionResponse(
      contractSection,
      contractSectionSubsectionsResponse,
    );
  }

  async makeContractSectionsResponse(contractSections: ContractSection[]) {
    const contractSectionsResponse: ContractSectionResponse[] = [];
    for (let i = 0; i < contractSections.length; i++) {
      const cs = contractSections[i];
      const ContractSectionResponse =
        await this.makeContractSectionResponse(cs);
      contractSectionsResponse.push(ContractSectionResponse);
    }
    return contractSectionsResponse;
  }
}
