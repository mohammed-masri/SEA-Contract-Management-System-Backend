import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  HasMany,
  Default,
} from 'sequelize-typescript';
import { BcryptUtils, PhoneNumberUtils, StringUtils } from 'src/utils';
import { OTP } from '../otp/otp.model';
import { Contract } from '../contract/contract.model';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['email'],
      name: 'unique_email',
    },
    {
      unique: true,
      fields: ['phoneNumber'],
      name: 'unique_phone_number',
    },
  ],
})
export class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      len: [3, 50],
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isLocked: boolean;

  @HasMany(() => OTP)
  OTPs: OTP[];

  @HasMany(() => Contract)
  contracts: Contract[];

  @BeforeCreate
  @BeforeUpdate
  static async handleSensitiveData(user: User) {
    if (user.email) {
      user.email = StringUtils.normalizeString(user.email);
    }
    if (user.password && user.changed('password')) {
      user.password = await BcryptUtils.hashPassword(user.password);
    }

    if (user.phoneNumber) {
      user.phoneNumber = PhoneNumberUtils.normalizePhoneNumber(
        user.phoneNumber,
      );
    }
  }
}
