import { Table, Column, Model, DataType, Default } from 'sequelize-typescript';

@Table
export class Oauthtoken extends Model<Oauthtoken> {
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  access_token: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refresh_token: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  api_domain: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  token_type: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  expires_in: number;

  @Default(DataType.NOW)
  @Column({
    allowNull: true,
  })
  createdAt!: Date;

  @Column({
    allowNull: true,
  })
  updatedAt!: Date;

  @Column({
    allowNull: true,
  })
  deletedAt!: Date;
}
