import {
  Table,
  Column,
  Model,
  DataType,
  HasMany
} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  password: string;
  
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  otp: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  delete_status?: boolean;
}
