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

import { Participant } from '../participant/participant.model';
import { ContractSection } from '../contract-section/contract-section.model';

@Table({
  tableName: 'contract-section-comments',
  timestamps: true,
  paranoid: true,
})
export class ContractSectionComment extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.TEXT('long'),
    allowNull: false,
  })
  content: string;

  @ForeignKey(() => ContractSection)
  @Column(DataType.UUID)
  contractSectionId: string;

  @ForeignKey(() => Participant)
  @Column(DataType.UUID)
  participantId: string;

  @ForeignKey(() => ContractSectionComment)
  @Column(DataType.UUID)
  parentId: string | null;

  @BelongsTo(() => ContractSection)
  contractSection: ContractSection;

  @BelongsTo(() => Participant)
  participant: Participant;

  @BelongsTo(() => ContractSectionComment, 'parentId')
  parentComment: ContractSectionComment;

  @HasMany(() => ContractSectionComment, 'parentId')
  replies: ContractSectionComment[];
}
