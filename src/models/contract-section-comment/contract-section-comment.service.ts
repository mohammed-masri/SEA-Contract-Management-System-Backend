import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractSectionComment } from './contract-section-comment.model';

@Injectable()
export class ContractSectionCommentService {
  constructor(
    @Inject(
      Constants.Database.DatabaseRepositories.ContractSectionCommentRepository,
    )
    private contractSectionCommentRepository: typeof ContractSectionComment,
  ) {}
}
