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

        if (orderShouldBe !== s.order) {
          await s.update({ order: orderShouldBe });
        }
      }
    }

    return await contractSection.destroy({ force: true });
  }

  async update(
    contract: Contract,
    contractSection: ContractSection,
    title: string,
    content: string,
    order: number,
    parentId: string | null,
  ) {
    contractSection.title = title;
    contractSection.content = content;

    const theParentChanged = contractSection.parentId !== parentId;
    const theOrderChanged = contractSection.order !== order;

    contractSection.title = title;
    contractSection.content = content;

    // parent changed
    // // fix the ordering in the old level
    // // fix the ordering in the new level
    // // change the parent to the new parent
    // // change the order to the new order
    if (theParentChanged) {
      // (order - 1 ) for all the sections after the current section in the old level
      const { contractSections: oldLevelEffectedSections } = await this.findAll(
        {
          where: {
            contractId: contract.id,
            parentId: contractSection.parentId,
            order: { [Op.gt]: contractSection.order },
          },
          order: [['order', 'ASC']],
        },
      );
      await Promise.all(
        oldLevelEffectedSections.map((section) =>
          section.update({ order: section.order - 1 }),
        ),
      );

      // (order + 1 ) for all the sections after the current section in the new level
      const { contractSections: newLevelEffectedSections } = await this.findAll(
        {
          where: {
            contractId: contract.id,
            parentId,
            order: { [Op.gte]: order },
          },
          order: [['order', 'ASC']],
        },
      );

      await Promise.all(
        newLevelEffectedSections.map((section) =>
          section.update({ order: section.order + 1 }),
        ),
      );

      contractSection.order = order;
      contractSection.parentId = parentId;
    }

    // parent doesn't changed
    // but order changed
    // // fix the ordering in the same level for the items from the oldOrder to newOrder
    // // set the new order to the section
    if (!theParentChanged && theOrderChanged) {
      let sumFactor = -1;
      let whereOrder: any = { [Op.gt]: contractSection.order, [Op.lte]: order };
      if (contractSection.order > order) {
        sumFactor = +1;
        whereOrder = { [Op.gte]: order, [Op.lt]: contractSection.order };
      }

      const { contractSections: effectedSections } = await this.findAll({
        where: {
          contractId: contract.id,
          parentId: contractSection.parentId,
          order: whereOrder,
        },
        order: [['order', 'ASC']],
      });

      await Promise.all(
        effectedSections.map((section) =>
          section.update({ order: section.order + sumFactor }),
        ),
      );

      contractSection.order = order;
    }

    const saved = await contractSection.save();
    return saved;
  }
}
