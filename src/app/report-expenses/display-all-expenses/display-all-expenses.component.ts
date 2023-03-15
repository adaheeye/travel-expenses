import {Component, OnDestroy, OnInit} from '@angular/core';
import {Activity} from '../activity.model';
import {ActivityService} from '../activity.service';
import {ActivatedRoute, Router} from '@angular/router';
import {mergeMap, Subject} from 'rxjs';
import {ExpenseWithOwedAmount} from '../expenseWithOwedAmaount.model';
import {takeUntil} from 'rxjs/operators';
import {Traveler} from "../traveler.model";
import {AppService} from "../app.service";
import {TravelerService} from "../traveler.service";

@Component({
  selector: 'display-all-expenses',
  templateUrl: './display-all-expenses.component.html',
  styleUrls: ['./display-all-expenses.component.scss']
})
export class DisplayAllExpensesComponent implements OnInit, OnDestroy {
  public expenses: Activity[] = [];
  public expenseWithDetailsMap: any = new Map<string, number>();
  public expensesSum: number = 0;
  private travelers: Traveler[] = [];
  private ngUnsubscribe: Subject<void> = new Subject();


  constructor(private expenseService: ActivityService,
              private travelerService: TravelerService,
              private route: ActivatedRoute,
              private appService: AppService,
              private _router: Router) {
  }

  public ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.ngUnsubscribe),
      mergeMap((paramMap) => {
        console.log('paramMap: ', paramMap);
        return this.travelerService.getTravelers()
      })
    ).subscribe((travelers: Traveler[]) => {
      this.travelers = travelers
      this.getExpenses();
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
    this.expenseService.getActivities()
      .subscribe((activities: Activity[]) => {
        if (!!activities.length) {
          this.expenses = activities;
          this.travelers.forEach((traveler, index) => {
            let totalExpensesWithOwedAmountForPaidBy = 0;
            let totalExpensesWithOwedAmountForOwedBy = 0;
            // calculate paid by expenses
            const filterExpenses = this.expenses.filter((expense) => expense.paidBy === traveler);
            const expenseWithOwedAmounts = filterExpenses.map((expense: Activity) => {
              return {
                id: expense._id,
                activityName: expense.activityName,
                activityDate: expense.activityDate,
                amount: expense.amount,
                paidBy: expense.paidBy,
                owedBy: expense.owedBy,
                details: expense.details,
                expensesWithOwedAmount: expense.owedBy.map((owedBy) => owedBy.firstName).includes('All') ? ((expense.amount / this.travelers.length) * (this.travelers.length - 1)) :
                  (expense.owedBy.length > 1 && expense.owedBy.map((owedBy) => owedBy.firstName).includes(traveler.firstName) ?
                    ((expense.amount / expense.owedBy.length) * (expense.owedBy.length - 1)) : expense.amount)
              }
            }) as ExpenseWithOwedAmount[];
            if (expenseWithOwedAmounts.length) {
              totalExpensesWithOwedAmountForPaidBy = expenseWithOwedAmounts.map((expense) => expense.expensesWithOwedAmount)
                .reduce((accumulator, current) => accumulator + current);
            }

            // calculate owed by expenses
            const filterExpenses2 = this.expenses.filter((expense) => expense.paidBy !== traveler &&
              (expense.owedBy?.map((owedBy) => owedBy.firstName).includes('All') ||
                expense.owedBy?.map((owedBy) => owedBy.firstName).includes(traveler.firstName as string | '')));
            const expenseWithOwedAmounts2 = filterExpenses2.map((expense: Activity) => {
              return {
                id: expense._id,
                activityName: expense.activityName,
                activityDate: expense.activityDate,
                amount: expense.amount,
                paidBy: expense.paidBy,
                owedBy: expense.owedBy,
                details: expense.details,
                expensesWithOwedAmount: expense.owedBy.map((owedBy) => owedBy.firstName).includes('All') ?
                  expense.amount / this.travelers.length :
                  expense.amount / expense.owedBy.length
              }
            }) as ExpenseWithOwedAmount[];
            if (expenseWithOwedAmounts2.length) {
              totalExpensesWithOwedAmountForOwedBy = expenseWithOwedAmounts2.map((expense) => expense.expensesWithOwedAmount)
                .reduce((accumulator, current) => accumulator + current);
            }
            if (totalExpensesWithOwedAmountForPaidBy > 0 || totalExpensesWithOwedAmountForOwedBy > 0) {
              this.expenseWithDetailsMap.set(`${traveler.firstName || ''} ${traveler.lastName || ''}`, (totalExpensesWithOwedAmountForPaidBy - totalExpensesWithOwedAmountForOwedBy))
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
