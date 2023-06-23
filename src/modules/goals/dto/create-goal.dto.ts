export class CreateGoalDto {
  readonly zohoGoalId: string;
  readonly status: string;
  readonly owner: string;
  readonly goalType: string;
  readonly title: string;
  readonly description: string;
  readonly isFinancial: string;
  readonly targetDate: string;
  readonly money_need: string;
  readonly money_have: string;
  readonly when_money_need: Date;
  readonly responsible: string;
  readonly frequent_money_save: string;
  readonly goal_priority: string;
  readonly delete_status?: boolean;
}



