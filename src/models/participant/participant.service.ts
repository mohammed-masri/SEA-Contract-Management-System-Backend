import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { Participant } from './participant.model';
import { Attributes, FindOptions } from 'sequelize';
import { Contract } from '../contract/contract.model';

@Injectable()
export class ParticipantService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ParticipantRepository)
    private participantRepository: typeof Participant,
  ) {}

  async findAll(
    options?: FindOptions<Attributes<Participant>>,
    page: number | null = null,
    limit: number | null = null,
  ) {
    let offset: number | null = null;
    if (page && limit) {
      offset = (page - 1) * limit;
      if (page < 1) page = 1;
    }
    const { count: totalCount, rows: participants } =
      await this.participantRepository.findAndCountAll({
        ...options,
        limit,
        offset,
      });
    return {
      totalCount,
      participants,
    };
  }

  async findParticipantForUserInContract(userId: string, contractId: string) {
    return await this.participantRepository.findOne({
      where: {
        userId,
        contractId,
      },
    });
  }

  async findParticipantsWithContractsForUser(
    userId: string,
    page: number | null = null,
    limit: number | null = null,
  ) {
    return await this.findAll(
      {
        where: { userId },
        order: [['createdAt', 'DESC']],
        include: [Contract],
      },
      page,
      limit,
    );
  }

  async create(
    type: Constants.Participant.ParticipantTypes,
    contractId: string,
    role: Constants.Participant.ParticipantRoles,
    userId: string | null,
    guestEmail: string | null,
  ) {
    const participant = new this.participantRepository({
      type,
      contractId,
      role,
      userId,
      guestEmail,
    });

    return await participant.save();
  }

  async deleteAllForContract(contractId: string) {
    await this.participantRepository.destroy({
      where: { contractId },
      force: true,
    });
  }
}
