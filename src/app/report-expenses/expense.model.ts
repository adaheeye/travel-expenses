export class Expense {
  public id?: number;
  public activityName: string = '';
  public activityDate?: string;
  public amount: number = 0;
  public paidBy: string = '';
  public owedBy: string[] = [];
  public details: string = '';
}
