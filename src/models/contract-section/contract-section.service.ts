import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractSection } from './contract-section.model';
import { ContractSectionTemplate } from '../contract-section-template/contract-section-template.model';
import { ContractSectionTemplateService } from '../contract-section-template/contract-section-template.service';
import { ContractSectionResponse } from './contract-section.dto';
import { Attributes, FindOptions } from 'sequelize';
import { Contract } from '../contract/contract.model';
import { Op } from 'sequelize';

@Injectable()
export class ContractSectionService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ContractSectionRepository)
    private contractSectionRepository: typeof ContractSection,
    private readonly contractSectionTemplateService: ContractSectionTemplateService,
  ) {}

  async findOne(options?: FindOptions<Attributes<ContractSection>>) {
    return await this.contractSectionRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<ContractSection>>) {
    const contractTemplate = await this.findOne(options);
    if (!contractTemplate)
      throw new NotFoundException(`Contract Section not found!`);

    return contractTemplate;
  }

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

  async create(
    contract: Contract,
    title: string,
    content: string,
    order: number,
    parentId: string | null,
  ) {
    if (parentId) await this.checkIsFound({ where: { id: parentId } });

    // Get the sections at the same level
    const { contractSections: sameLevelSections } = await this.findAll({
      where: { contractId: contract.id, parentId },
      order: [['order', 'ASC']],
    });

    // Calculate the max order of current sections
    const maxOrder =
      sameLevelSections.length > 0
        ? sameLevelSections[sameLevelSections.length - 1].order
        : 0;

    // If specified order is greater than maxOrder, append the new section to the end
    const finalOrder = order > maxOrder + 1 ? maxOrder + 1 : order;

    // Shift the order of existing sections if they come after the new section's final order
    await Promise.all(
      sameLevelSections
        .filter((section) => section.order >= finalOrder)
        .map((section) => section.update({ order: section.order + 1 })),
    );

    const contractSection = new this.contractSectionRepository({
      title,
      content,
      order: finalOrder,
      contractId: contract.id,
      parentId,
    });

    const saved = await contractSection.save();

    return saved;
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

  async delete(contractSection: ContractSection, reorderSections = true) {
    // delete children first
    const { contractSections: contractSectionSubsections } = await this.findAll(
      {
        where: { parentId: contractSection.id },
        order: [['order', 'ASC']],
      },
    );

    for (let i = 0; i < contractSectionSubsections.length; i++) {
      await this.delete(contractSectionSubsections[i], false);
    }

    // reorder the sections only in the same level of the deleted section, no need to so that for the children levels
    if (reorderSections) {
      // Get the sections at the same level
      const { contractSections: sameLevelSections } = await this.findAll({
        where: {
          id: { [Op.ne]: contractSection.id },
          contractId: contractSection.contractId,
          parentId: contractSection.parentId,
        },
        order: [['order', 'ASC']],
      });

      for (let i = 0; i < sameLevelSections.length; i++) {
        const orderShouldBe = i + 1;
        const s = sameLevelSections[i];

        console.log('current order is: ', s.order);
        console.log('order should be: ', orderShouldBe);

        if (orderShouldBe !== s.order) {
          console.log('update');
          await s.update({ order: orderShouldBe });
        }
        console.log('-------------------------------------------');
      }
    }

    return await contractSection.destroy({ force: true });
  }
}
