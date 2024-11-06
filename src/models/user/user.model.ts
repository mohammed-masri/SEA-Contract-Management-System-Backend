import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  HasMany,
} from 'sequelize-typescript';
import { BcryptUtils, PhoneNumberUtils, StringUtils } from 'src/utils';
import { OTP } from '../otp/otp.model';

@Table({
  tableName: 'users', // Set table name if different from model name
  timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  paranoid: true, // Enables soft deletes by adding a deletedAt timestamp
})
export class User extends Model {
  @PrimaryKey // Sets this column as the primary key
  @AutoIncrement // Auto-increment for IDs
  @Column
  id: number;

  @Column({
    type: DataType.STRING, // Specifies the data type
    allowNull: false, // Sets this column as NOT NULL
    validate: {
      len: [3, 50], // Adds a length validation for the name (between 3 and 50 characters)
    },
  })
  name: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
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
