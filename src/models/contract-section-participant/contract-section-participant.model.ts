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
import { ContractSection } from '../contract-section/contract-section.model';
import { Participant } from '../participant/participant.model';
import { Constants } from 'src/config';

@Table({
  tableName: 'contract-section-participants',
  timestamps: true,
  paranoid: true,
})
export class ContractSectionParticipant extends Model {
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

  @Default(Constants.Contract.ContractSectionParticipantStatuses.Pending)
  @Column({
    type: DataType.ENUM(
      ...Object.values(Constants.Contract.ContractSectionParticipantStatuses),
    ),
  })
  status: Constants.Contract.ContractSectionParticipantStatuses;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isLocked: boolean;

  @BelongsTo(() => ContractSection)
  contractSection: ContractSection;

  @BelongsTo(() => Participant)
  participant: Participant;
}
