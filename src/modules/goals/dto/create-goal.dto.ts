export class CreateGoalDto {
  readonly title: string;
  readonly ownerId: string;
  readonly ownerType: string;
  readonly status: string;
  readonly goalType: string;
  readonly money_need: string;
  readonly money_have: string;
  readonly targetDate: string;
  readonly responsible: string;
  readonly when_money_need: Date;
  readonly frequent_money_save: string;
  readonly goal_priority: string;
  readonly delete_status?: boolean;
}