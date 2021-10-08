import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {Expense} from '../expense.model';
import {ReportExpensesService} from '../report-expenses.service';
import {isNumeric} from 'rxjs/internal-compatibility';

@Component({
  selector: 'display-expense',
  templateUrl: './display-expense.component.html',
  styleUrls: ['./display-expense.component.scss']
})
export class DisplayExpenseComponent implements OnInit, OnDestroy {

  public expenses: Expense[] = [];
  public expense: Expense | undefined;
  private ngUnsubscribe: Subject<void> = new Subject();
  private id: string | null = '';

  constructor(private reportExpensesService: ReportExpensesService,
              private route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((paramMap) => {
      this.id = paramMap.get('id');
      if (isNumeric(this.id)) {
        this.getExpenses();
      }
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getExpenses() {
    this.reportExpensesService.getExpenses()
      .subscribe((activities: Expense[]) => {
        if (!!activities.length) {
          this.expenses  = activities;
          if (!!this.id) {
            this.expense = this.expenses.find((expense: Expense) => expense.id === parseInt(String(this.id)));
          }
        }
      });
  }

}
