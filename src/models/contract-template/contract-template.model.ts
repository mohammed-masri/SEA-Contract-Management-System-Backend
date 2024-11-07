import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { ContractSectionTemplate } from '../contract-section-template/contract-section-template.model';
import { Contract } from '../contract/contract.model';
import { Constants } from 'src/config';

@Table({
  tableName: 'contract-templates',
  timestamps: true,
  paranoid: true,
})
export class ContractTemplate extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Default(Constants.Contract.ContractTemplateStatuses.Draft)
  @Column({
    type: DataType.ENUM(
      ...Object.values(Constants.Contract.ContractTemplateStatuses),
    ),
  })
  status: Constants.Contract.ContractTemplateStatuses;

  @HasMany(() => ContractSectionTemplate)
  sections: ContractSectionTemplate[];

  @HasMany(() => Contract)
  contracts: Contract[];
}
