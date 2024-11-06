import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ParticipantService } from 'src/models/participant/participant.service';
import { participantProviders } from 'src/models/participant/participant.provider';

export const ParticipantModuleDependencies = {
  imports: [DatabaseModule],
  providers: [ParticipantService, ...participantProviders],
};

@Module({
  imports: [...ParticipantModuleDependencies.imports],
  providers: [...ParticipantModuleDependencies.providers],
})
export class ParticipantModule {}
