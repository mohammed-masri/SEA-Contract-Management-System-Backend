import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Constants } from 'src/config';
import { User } from '../user/user.model';
import { ContractSection } from '../contract-section/contract-section.model';
import { Participant } from '../participant/participant.model';
import { ContractTemplate } from '../contract-template/contract-template.model';

@Table({
  tableName: 'contracts',
  timestamps: true,
  paranoid: true,
})
export class Contract extends Model {
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

  @Default(Constants.Contract.ContractStatuses.Draft)
  @Column({
    type: DataType.ENUM(...Object.values(Constants.Contract.ContractStatuses)),
  })
  status: Constants.Contract.ContractStatuses;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string | null;

  @HasMany(() => ContractSection)
  sections: ContractSection[];

  @HasMany(() => Participant)
  participants: Participant[];

  @ForeignKey(() => ContractTemplate)
  @Column(DataType.UUID)
  templateId: string;
}
