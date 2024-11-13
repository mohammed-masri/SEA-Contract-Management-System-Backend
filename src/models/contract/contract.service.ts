import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import {
  ContractFullResponseForUser,
  ContractShortResponseForUser,
} from './contract.dto';
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

  async makeContractShortResponseForUser(
    contract: Contract,
    role: Constants.Participant.ParticipantRoles,
  ) {
    return new ContractShortResponseForUser(contract, role);
  }

  async makeContractShortArrayDataResponse(
    contracts: ContractShortResponseForUser[],
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
    const { participants, totalCount } =
      await this.participantService.findParticipantsWithContractsForUser(
        userId,
        page,
        limit,
      );

    const contractsResponse: ContractShortResponseForUser[] = [];

    for (let i = 0; i < participants.length; i++) {
      const participant = participants[i];

      const contractResponse = await this.makeContractShortResponseForUser(
        participant.contract,
        participant.role,
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

  async makeContractFullResponseForUser(contract: Contract, userId: string) {
    const participant =
      await this.participantService.findParticipantForUserInContract(
        userId,
        contract.id,
      );

    const { contractSections } = await this.contractSectionService.findAll({
      where: { contractId: contract.id, parentId: null },
      order: [['order', 'ASC']],
    });

    const contractSectionsResponse =
      await this.contractSectionService.makeContractSectionsResponse(
        contractSections,
      );

    return new ContractFullResponseForUser(
      contract,
      participant.role,
      contractSectionsResponse,
    );
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

    await this.participantService.deleteAllForContract(contract.id);

    await contract.destroy({ force: true });

    return true;
  }

  async checkUserIsAParticipantOfContract(userId: string, contractId: string) {
    const participant =
      await this.participantService.findParticipantForUserInContract(
        userId,
        contractId,
      );
    if (!participant)
      throw new UnauthorizedException(
        `You can't access to this contract, you are not a participant`,
      );

    return participant;
  }

  async checkUserIsOwnerOfContract(userId: string, contractId: string) {
    const participant = await this.checkUserIsAParticipantOfContract(
      userId,
      contractId,
    );
    if (participant.role !== Constants.Participant.ParticipantRoles.Owner) {
      throw new UnauthorizedException(
        `You can't access to this contract, you are not the owner`,
      );
    }
  }
}
