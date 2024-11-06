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
import { ContractTemplate } from '../contract-template/contract-template.model';

@Table({
  tableName: 'contract-section-templates',
  timestamps: true,
  paranoid: true,
})
export class ContractSectionTemplate extends Model {
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

  @ForeignKey(() => ContractTemplate)
  @Column(DataType.UUID)
  contractTemplateId: string;

  @ForeignKey(() => ContractSectionTemplate)
  @Column(DataType.UUID)
  parentId: string | null;

  @BelongsTo(() => ContractSectionTemplate, 'parentId')
  parentSection: ContractSectionTemplate;

  @HasMany(() => ContractSectionTemplate, 'parentId')
  subSections: ContractSectionTemplate[];
}
