import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Contract } from '../contract/contract.model';
import { ContractSectionParticipant } from '../contract-section-participant/contract-section-participant.model';
import { Constants } from 'src/config';
import { ContractSectionHistory } from '../contract-section-history/contract-section-history.model';

@Table({
  tableName: 'contract-sections',
  timestamps: true,
  paranoid: true,
})
export class ContractSection extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  order: number;

  @Default(Constants.Contract.ContractSectionStatuses.Pending)
  @Column({
    type: DataType.ENUM(
      ...Object.values(Constants.Contract.ContractSectionStatuses),
    ),
  })
  overallStatus: Constants.Contract.ContractSectionStatuses;

  @ForeignKey(() => Contract)
  @Column(DataType.UUID)
  contractId: string;

  @ForeignKey(() => ContractSection)
  @Column(DataType.UUID)
  parentId: string | null;

  @BelongsTo(() => ContractSection, 'parentId')
  parentSection: ContractSection;

  @HasMany(() => ContractSection, 'parentId')
  subSections: ContractSection[];

  @HasMany(() => ContractSectionParticipant)
  participantStatuses: ContractSectionParticipant[];

  @HasMany(() => ContractSectionHistory)
  history: ContractSectionHistory[];
}
