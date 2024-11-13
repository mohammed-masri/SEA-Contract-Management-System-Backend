import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Constants } from 'src/config';
import { Contract } from './contract.model';
import { ContractTemplateService } from '../contract-template/contract-template.service';
import {
  ContractShortArrayDataResponse,
  CreateContractDto,
} from 'src/controllers/contract/contract.dto';
import { ContractSectionTemplate } from '../contract-section-template/contract-section-template.model';

import { ContractTemplate } from '../contract-template/contract-template.model';
import { ContractSectionService } from '../contract-section/contract-section.service';
import { Attributes, FindOptions } from 'sequelize';
import { ContractFullResponse, ContractShortResponse } from './contract.dto';
import { ParticipantService } from '../participant/participant.service';

@Injectable()
export class ContractService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ContractRepository)
    private contractRepository: typeof Contract,
    private readonly contractTemplateService: ContractTemplateService,
    private readonly contractSectionService: ContractSectionService,
    private readonly participantService: ParticipantService,
  ) {}

  async findOne(options?: FindOptions<Attributes<Contract>>) {
    return await this.contractRepository.findOne(options);
  }

  async checkIsFound(options?: FindOptions<Attributes<Contract>>) {
    const contract = await this.findOne(options);
    if (!contract) throw new NotFoundException(`Contract not found!`);

    return contract;
  }

  async findAll(
    options?: FindOptions<Attributes<Contract>>,
    page: number | null = null,
    limit: number | null = null,
  ) {
    let offset: number | null = null;
    if (page && limit) {
      offset = (page - 1) * limit;
      if (page < 1) page = 1;
    }
    const { count: totalCount, rows: contracts } =
      await this.contractRepository.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    return {
      totalCount,
      contracts,
    };
  }

  async create(body: CreateContractDto, userId: string) {
    const contractTemplate = await this.contractTemplateService.checkIsFound({
      where: {
        id: body.templateId,
        status: Constants.Contract.ContractTemplateStatuses.Published,
      },
      include: [{ model: ContractSectionTemplate, where: { parentId: null } }],
    });

    const contract = await this.createFromContractTemplate(
      body.name,
      body.description,
      userId,
      contractTemplate,
    );

    await this.participantService.create(
      Constants.Participant.ParticipantTypes.User,
      contract.id,
      Constants.Participant.ParticipantRoles.Owner,
      userId,
      null,
    );

    return contract;
  }

  async createFromContractTemplate(
    name: string,
    description: string,
    userId: string,
    ct: ContractTemplate,
  ) {
    const contract = new this.contractRepository({
      name,
      description,
      userId,
      templateId: ct.id,
    });

    const saved = await contract.save();

    for (let i = 0; i < ct.sections.length; i++) {
      const cst = ct.sections[i];
      await this.contractSectionService.createFromContractSectionTemplate(
        cst,
        saved.id,
        null,
      );
    }

    return contract;
  }

  async makeContractShortResponse(contract: Contract) {
    return new ContractShortResponse(contract);
  }

  async makeContractShortArrayDataResponse(
    contracts: ContractShortResponse[],
    totalCount: number,
    page: number,
    limit: number,
  ) {
    return new ContractShortArrayDataResponse(
      totalCount,
      contracts,
      page,
      limit,
    );
  }

  async makeContractShortArrayDataResponseForUser(
    userId: string,
    page: number,
    limit: number,
  ) {
    const { totalCount, contracts } = await this.findAll(
      { where: { userId } },
      page,
      limit,
    );

    const contractsResponse: ContractShortResponse[] = [];

    for (let i = 0; i < contracts.length; i++) {
      const contractResponse = await this.makeContractShortResponse(
        contracts[i],
      );
      contractsResponse.push(contractResponse);
    }

    return await this.makeContractShortArrayDataResponse(
      contractsResponse,
      totalCount,
      page,
      limit,
    );
  }

  async makeContractFullResponse(contract: Contract) {
    const { contractSections } = await this.contractSectionService.findAll({
      where: { contractId: contract.id, parentId: null },
      order: [['order', 'ASC']],
    });

    const contractSectionsResponse =
      await this.contractSectionService.makeContractSectionsResponse(
        contractSections,
      );

    return new ContractFullResponse(contract, contractSectionsResponse);
  }

  async calculateStatus(
    contract: Contract,
    action: 'create-section' | 'update-section' | 'delete-section',
  ) {
    switch (action) {
      case 'create-section':
      case 'delete-section':
      case 'update-section': {
        if (
          [
            Constants.Contract.ContractStatuses.Draft,
            Constants.Contract.ContractStatuses.DraftCompleted,
          ].includes(contract.status)
        )
          contract.status = Constants.Contract.ContractStatuses.Draft;
        else contract.status = Constants.Contract.ContractStatuses.Pending;

        break;
      }

      default:
        break;
    }

    await contract.save();
  }

  async delete(contract: Contract) {
    const { contractSections } = await this.contractSectionService.findAll({
      where: { parentId: null, contractId: contract.id },
    });

    await Promise.all(
      contractSections.map((section) =>
        this.contractSectionService.delete(section),
      ),
    );

    await contract.destroy({ force: true });

    return true;
  }
}
