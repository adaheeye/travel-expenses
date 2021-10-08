import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {Expense} from '../expense.model';
import {ReportExpensesService} from '../report-expenses.service';
import {ExpenseWithOwedAmount} from '../expenseWithOwedAmaount.model';
import {TravelerEnum} from '../util/travelerEnum';

@Component({
  selector: 'paid-by',
  templateUrl: './paid-by.component.html',
  styleUrls: ['./paid-by.component.scss']
})
export class PaidByComponent implements OnInit, OnDestroy {
  @Input() public passToComponent: boolean = false;
  @Output() expensesWithOwedAmountEvent: EventEmitter<any> = new EventEmitter();
  public expenses: Expense[] = [];
  public expenseWithOwedAmounts: ExpenseWithOwedAmount[] = [];
  public name: any;
  public totalPaidAmount: number = 0;
  public totalExpensesWithOwedAmount: number = 0;
  public selectedTraveler: string | null = '';
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
      this.selectedTraveler = paramMap.get('traveler');
      this.getExpenses();
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public openLink(expense: ExpenseWithOwedAmount): void {
    this._router.navigate(['display-expense', expense.id], { replaceUrl: true }).then();
  }

  private getExpenses() {
    this.reportExpensesService.getExpenses()
      .subscribe((activities: Expense[]) => {
        if (!!activities.length) {
          this.expenses = activities;
          this.expenses = this.expenses.filter((expense) => expense.paidBy === this.selectedTraveler);
          if (this.expenses.length) {
            this.totalPaidAmount = this.expenses.map((expense) => expense.amount)
              .reduce((accumulator, current) => accumulator + current);
          }
          this.expenseWithOwedAmounts = this.expenses.map((expense: Expense) => {
            return {
              id: expense.id,
              activityName: expense.activityName,
              activityDate: expense.activityDate,
              amount: expense.amount,
              paidBy: expense.paidBy,
              owedBy: expense.owedBy,
              details: expense.details,
              expensesWithOwedAmount: expense.owedBy.includes('All') ? ((expense.amount / this.travelers.length) * (this.travelers.length - 1)) :
                (expense.owedBy.length > 1 && expense.owedBy.includes(<string>this.selectedTraveler) ?
                  ((expense.amount / expense.owedBy.length) * (expense.owedBy.length - 1)) : expense.amount)
            }
          })
          if (this.expenseWithOwedAmounts.length) {
            this.totalExpensesWithOwedAmount = this.expenseWithOwedAmounts.map((expense) => expense.expensesWithOwedAmount)
              .reduce((accumulator, current) => accumulator + current);
          }
        this.expensesWithOwedAmountEvent.emit(this.totalExpensesWithOwedAmount);
        }

      });
  }
}
