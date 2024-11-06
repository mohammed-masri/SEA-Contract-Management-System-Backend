import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { contractSectionParticipantProviders } from 'src/models/contract-section-participant/contract-section-participant.provider';
import { ContractSectionParticipantService } from 'src/models/contract-section-participant/contract-section-participant.service';

export const ContractSectionParticipantModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    ContractSectionParticipantService,
    ...contractSectionParticipantProviders,
  ],
};

@Module({
  imports: [...ContractSectionParticipantModuleDependencies.imports],
  providers: [...ContractSectionParticipantModuleDependencies.providers],
})
export class ContractSectionParticipantModule {}
