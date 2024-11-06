import { Inject, Injectable } from '@nestjs/common';
import { Constants } from 'src/config';
import { Contract } from './contract.model';

@Injectable()
export class ContractService {
  constructor(
    @Inject(Constants.Database.DatabaseRepositories.ContractRepository)
    private contractRepository: typeof Contract,
  ) {}
}
