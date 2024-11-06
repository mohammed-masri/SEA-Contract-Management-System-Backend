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
    type: DataType.ENUM('User', 'Guest'),
    allowNull: false,
  })
  type: 'User' | 'Guest';

  @ForeignKey(() => Contract)
  @Column(DataType.UUID)
  contractId: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string | null;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  guestEmail: string | null;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Contract, 'contractId')
  contract: Contract;
}
