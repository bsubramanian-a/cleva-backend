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
    allowNull: true,
  })
  zohoGoalId: string;

  @Column({
    type: DataType.ENUM,
    unique: false,
    values: ['To Do', 'Doing', 'Paused'],
    allowNull: true,
  })
  status: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  owner: string;

  @Column({
    type: DataType.ENUM,
    unique: false,
    values: ['Property', 'Travel', 'Kids Education & Investments', "Lifestyle", "Assets & Liabilities", "Save for Something Big", "Super/Retirement", "Other"],
    allowNull: true,
  })
  goalType: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  title: string;

  @Column({
    type: DataType.TEXT,
    unique: false,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isFinancial?: boolean;

  @Column({
    type: DataType.DATE,
    unique: false,
    allowNull: true,
  })
  targetDate: Date;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  money_need: string;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  money_have: string;

  @Column({
    type: DataType.DATE,
    unique: false,
    allowNull: true,
  })
  when_money_need: Date;

  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: true,
  })
  responsible: string;

  @Column({
    type: DataType.ENUM,
    unique: false,
    values: ['Weekly', 'Fortnightly', 'Monthly'],
    allowNull: true,
  })
  frequent_money_save: string;

  @Column({
    type: DataType.STRING, 
    unique: false,
    values: ['A Must Have', 'Nice To Have', 'Maybe One Day'],
    allowNull: true,
  })
  goal_priority: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  delete_status?: boolean;
}
