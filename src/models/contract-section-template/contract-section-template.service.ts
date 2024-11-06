import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractSectionTemplate } from './contract-section-template.model';

@Injectable()
export class ContractSectionTemplateService {
  constructor(
    @Inject(
      Constants.Database.DatabaseRepositories.ContractSectionTemplateRepository,
    )
    private contractSectionTemplateRepository: typeof ContractSectionTemplate,
  ) {}
}
