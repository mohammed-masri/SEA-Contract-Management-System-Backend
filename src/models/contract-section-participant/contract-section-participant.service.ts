import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractSectionParticipant } from './contract-section-participant.model';

@Injectable()
export class ContractSectionParticipantService {
  constructor(
    @Inject(
      Constants.Database.DatabaseRepositories
        .ContractSectionParticipantRepository,
    )
    private contractSectionParticipantRepository: typeof ContractSectionParticipant,
  ) {}
}
