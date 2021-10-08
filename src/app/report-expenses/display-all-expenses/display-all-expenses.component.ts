import { Component, OnInit } from '@angular/core';
import {Expense} from '../expense.model';
import {ReportExpensesService} from '../report-expenses.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {ExpenseWithOwedAmount} from '../expenseWithOwedAmaount.model';
import {TravelerEnum} from '../util/travelerEnum';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'display-all-expenses',
  templateUrl: './display-all-expenses.component.html',
  styleUrls: ['./display-all-expenses.component.scss']
})
export class DisplayAllExpensesComponent implements OnInit {
  public expenses: Expense[] = [];
  public expenseWithDetailsMap: any = new Map<string, number>();
  public expensesSum: number = 0;
  private travelers: string[] = [];
  private ngUnsubscribe: Subject<void> = new Subject();


  constructor(private reportExpensesService: ReportExpensesService,
              private route: ActivatedRoute,
              private _router: Router) {
  }

  public ngOnInit(): void {
    this.travelers = [...Object.values(TravelerEnum)];
    this.route.paramMap.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((paramMap) => {
      this.getExpenses();
    });
  }

  public isExpenseValueGreaterThanMinusOne(expense: any): boolean {
    return expense.value > -1;
  }

  public isExpenseValueLessThanZero(expense: any): boolean {
    return expense.value < 0;
  }

  public getExpenseValue(expense: any): number {
    return expense.value;
  }


  private getExpenses() {
    this.reportExpensesService.getExpenses()
      .subscribe((activities: Expense[]) => {
        if (!!activities.length) {
          this.expenses = activities;
          this.travelers.forEach((value, index) => {
            let totalExpensesWithOwedAmountForPaidBy = 0;
            let totalExpensesWithOwedAmountForOwedBy = 0;
            // calculate paid by expenses
            const filterExpenses = this.expenses.filter((expense) => expense.paidBy === value);
            const expenseWithOwedAmounts = filterExpenses.map((expense: Expense) => {
              return {
                id: expense.id,
                activityName: expense.activityName,
                activityDate: expense.activityDate,
                amount: expense.amount,
                paidBy: expense.paidBy,
                owedBy: expense.owedBy,
                details: expense.details,
                expensesWithOwedAmount: expense.owedBy.includes('All') ? ((expense.amount / this.travelers.length) * (this.travelers.length - 1)) :
                  (expense.owedBy.length > 1 && expense.owedBy.includes(<string>value) ?
                    ((expense.amount / expense.owedBy.length) * (expense.owedBy.length - 1)) : expense.amount)
              }
            }) as ExpenseWithOwedAmount[];
            if (expenseWithOwedAmounts.length) {
              totalExpensesWithOwedAmountForPaidBy = expenseWithOwedAmounts.map((expense) => expense.expensesWithOwedAmount)
                .reduce((accumulator, current) => accumulator + current);
            }

            // calculate owed by expenses
            const filterExpenses2 = this.expenses.filter((expense) => expense.paidBy !== value &&
              (expense.owedBy?.includes('All') || expense.owedBy?.includes(value as string | '')));
            const expenseWithOwedAmounts2 = filterExpenses2.map((expense: Expense) => {
              return {
                id: expense.id,
                activityName: expense.activityName,
                activityDate: expense.activityDate,
                amount: expense.amount,
                paidBy: expense.paidBy,
                owedBy: expense.owedBy,
                details: expense.details,
                expensesWithOwedAmount: expense.owedBy.includes('All') ?
                  expense.amount / this.travelers.length :
                  expense.amount / expense.owedBy.length
              }
            }) as ExpenseWithOwedAmount[];
            if (expenseWithOwedAmounts2.length) {
              totalExpensesWithOwedAmountForOwedBy = expenseWithOwedAmounts2.map((expense) => expense.expensesWithOwedAmount)
                .reduce((accumulator, current) => accumulator + current);
            }
            if (totalExpensesWithOwedAmountForPaidBy > 0 || totalExpensesWithOwedAmountForOwedBy > 0) {
              this.expenseWithDetailsMap.set(value, (totalExpensesWithOwedAmountForPaidBy - totalExpensesWithOwedAmountForOwedBy))
            }
          });
        }
        this.calculateExpensesSum();
      });
  }

  private calculateExpensesSum(): void {
    const expenseWithDetailsArray = Array.from(this.expenseWithDetailsMap.values()) as number[];
     expenseWithDetailsArray.forEach((value, i) => {
       this.expensesSum += Math.round((value + Number.EPSILON) * 100) / 100;
    })
  }


}
