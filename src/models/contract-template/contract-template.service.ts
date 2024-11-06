import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { ContractTemplate } from './contract-template.model';

@Injectable()
export class ContractTemplateService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ContractTemplateRepository)
    private contractTemplateRepository: typeof ContractTemplate,
  ) {}
}
