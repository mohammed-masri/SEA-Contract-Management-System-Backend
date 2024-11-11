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
import { User } from '../user/user.model';
import { Contract } from '../contract/contract.model';
import { Constants } from 'src/config';

@Table({
  tableName: 'participants',
  timestamps: true,
  paranoid: true,
})
export class Participant extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(Constants.Participant.ParticipantTypes),
    ),
    allowNull: false,
  })
  type: Constants.Participant.ParticipantTypes;

  @ForeignKey(() => Contract)
  @Column(DataType.UUID)
  contractId: string;

  @Column({
    type: DataType.ENUM(
      ...Object.values(Constants.Participant.ParticipantRoles),
    ),
  })
  role: Constants.Participant.ParticipantRoles;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string | null;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  guestEmail: string | null;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Contract, 'contractId')
  contract: Contract;
}
