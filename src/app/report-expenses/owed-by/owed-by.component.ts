import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Expense} from '../expense.model';
import {Subject} from 'rxjs';
import {ReportExpensesService} from '../report-expenses.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {ExpenseWithOwedAmount} from '../expenseWithOwedAmaount.model';
import {TravelerEnum} from '../util/travelerEnum';

@Component({
  selector: 'owed-by',
  templateUrl: './owed-by.component.html',
  styleUrls: ['./owed-by.component.scss']
})
export class OwedByComponent implements OnInit, OnDestroy {
  @Input() public passToComponent: boolean = false;
  @Output() expensesWithOwedAmountEvent: EventEmitter<any> = new EventEmitter();
  public expenses: Expense[] = [];
  public expensesWithOwedAmount: ExpenseWithOwedAmount[] = [];
  public name: any;
  public selectedTraveler: string | null = '';
  public totalExpensesWithOwedAmount: number = 0;
  private travelers: string[] = []
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private reportExpensesService: ReportExpensesService,
              private route: ActivatedRoute,
              private _router: Router) {
  }

  ngOnInit(): void {
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
    this._router.navigate(['display-expense', expense.id], {replaceUrl: true}).then();
  }

  private getExpenses() {
    this.reportExpensesService.getExpenses()
      .subscribe((activities: Expense[]) => {
        if (!!activities.length) {
          this.expenses = activities;
          this.expenses = this.expenses.filter((expense) => expense.paidBy !== this.selectedTraveler &&
            (expense.owedBy?.includes('All') || expense.owedBy?.includes(this.selectedTraveler as string | '')));
          this.expensesWithOwedAmount = this.expenses.map((expense: Expense) => {
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
          })
          if (this.expensesWithOwedAmount.length) {
            this.totalExpensesWithOwedAmount = this.expensesWithOwedAmount.map((expense) => expense.expensesWithOwedAmount)
              .reduce((accumulator, current) => accumulator + current);
          }
          this.expensesWithOwedAmountEvent.emit(this.totalExpensesWithOwedAmount);
        }
      });
  }

}
