import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { contractSectionCommentProviders } from 'src/models/contract-section-comment/contract-section-comment.provider';
import { ContractSectionCommentService } from 'src/models/contract-section-comment/contract-section-comment.service';

export const ContractSectionCommentModuleDependencies = {
  imports: [DatabaseModule],
  providers: [
    ContractSectionCommentService,
    ...contractSectionCommentProviders,
  ],
};

@Module({
  imports: [...ContractSectionCommentModuleDependencies.imports],
  providers: [...ContractSectionCommentModuleDependencies.providers],
})
export class ContractSectionCommentModule {}
