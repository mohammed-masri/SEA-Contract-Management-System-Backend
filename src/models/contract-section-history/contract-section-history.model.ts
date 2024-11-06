import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Participant } from '../participant/participant.model';
import { ContractSection } from '../contract-section/contract-section.model';
import { Constants } from 'src/config';

@Table({
  tableName: 'contract-section-histories',
  timestamps: true,
  paranoid: true,
})
export class ContractSectionHistory extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => ContractSection)
  @Column(DataType.UUID)
  contractSectionId: string;

  @ForeignKey(() => Participant)
  @Column(DataType.UUID)
  participantId: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(Constants.Contract.ContractSectionHistoryActions),
    ),
    allowNull: false,
  })
  action: Constants.Contract.ContractSectionHistoryActions;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: true,
  })
  oldContent: string | null;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: true,
  })
  newContent: string | null;

  @BelongsTo(() => ContractSection)
  contractSection: ContractSection;

  @BelongsTo(() => Participant)
  participant: Participant;
}
