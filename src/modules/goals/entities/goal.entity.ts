import {
  Table,
  Column,
  Model,
  DataType,
  HasMany
} from 'sequelize-typescript';

@Table
export class Goal extends Model<Goal> {
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  ownerId: string;

 @Column({
    type: DataType.ENUM,
    unique: false,
    values: ['single', 'joint', 'cleva'],
    allowNull: false,
  })
  ownerType: string;

  @Column({
    type: DataType.ENUM,
    unique: false,
    values: ['To Do', 'Doing', 'Paused'],
    allowNull: false,
  })
  status: string;

  @Column({
    type: DataType.ENUM,
    unique: false,
    values: ['Goal Type1', 'Goal Type2', 'Goal Type3'],
    allowNull: false,
  })
  goalType: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  money_need: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  money_have: string;

  @Column({
    type: DataType.DATE,
    unique: false,
    allowNull: false,
  })
  targetDate: Date;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  responsible: string;

  @Column({
    type: DataType.DATE,
    unique: false,
    allowNull: false,
  })
  when_money_need: Date;

  @Column({
    type: DataType.ENUM,
    unique: false,
    values: ['Weekly', 'Fortnightly', 'Monthly'],
    allowNull: false,
  })
  frequent_money_save: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    values: ['A Must Have', 'Nice To Have', 'Maybe One Day'],
    allowNull: false,
  })
  goal_priority: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  delete_status?: boolean;
}
