import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  Default,
  ForeignKey,
} from 'sequelize-typescript';
import { Constants } from 'src/config';
import { User } from '../user/user.model';

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
    type: DataType.ENUM(...Object.values(Constants.Contract.ContractStatuses)),
  })
  status: Constants.Contract.ContractStatuses;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string | null;
}
