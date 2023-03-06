import {Traveler} from "./traveler.model";

export class ExpenseWithOwedAmount {
  public id?: string;
  public activityName: string = '';
  public activityDate?: string;
  public amount: number = 0;
  public paidBy: Traveler;
  public owedBy: Traveler[] = [];
  public details?: string;
  public expensesWithOwedAmount: number = 0;
}
