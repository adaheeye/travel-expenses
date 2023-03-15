import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import {mergeMap, of, Subject} from 'rxjs';
import { Activity } from '../activity.model';
import { ActivityService } from '../activity.service';
import { ExpenseWithOwedAmount } from '../expenseWithOwedAmaount.model';
import { AppService } from "../app.service";
import { Traveler } from "../traveler.model";
import {TravelerService} from "../traveler.service";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'paid-by',
  templateUrl: './paid-by.component.html',
  styleUrls: ['./paid-by.component.scss']
})
export class PaidByComponent implements OnInit, OnDestroy {
  @Input() public passToComponent: boolean = false;
  @Output() expensesWithOwedAmountEvent: EventEmitter<any> = new EventEmitter();
  public expenses: Activity[] = [];
  public expenseWithOwedAmounts: ExpenseWithOwedAmount[] = [];
  public name: any;
  public totalPaidAmount: number = 0;
  public totalExpensesWithOwedAmount: number = 0;
  public selectedTraveler: Traveler | null = null;
  private travelers: Traveler[] = [];
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private reportExpensesService: ActivityService,
              private appService: AppService,
              private titleCasePipe: TitleCasePipe,
              private travelerService: TravelerService,
              private route: ActivatedRoute,
              private _router: Router) {
  }

  public ngOnInit(): void {
    this.travelerService.getTravelers()
      .pipe(takeUntil(this.ngUnsubscribe),
        mergeMap((travelers: Traveler[]) => {
          this.travelers = travelers
          return this.route.paramMap;
        }),
        mergeMap((paramMap) => {
          const travelerId = paramMap.get('travelerId');
          if (travelerId) {
            return this.travelerService.findById(travelerId)
          } else {
            return of(null)
          }
        }))
      .subscribe((traveler: Traveler | null) => {
        console.log('traveler: ', traveler);
        this.selectedTraveler = traveler;
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

  public getOwedBy(owedBy: Traveler[]): string {
    return owedBy.map((oB) => this.titleCasePipe.transform(oB.firstName)).join(', ');
  }

  private getExpenses() {
    this.reportExpensesService.getActivities()
      .subscribe((activities: Activity[]) => {
        if (!!activities.length) {
          this.expenses = activities;
          this.expenses = this.expenses.filter((expense) => expense.paidBy.firstName === this.selectedTraveler?.firstName);
          if (this.expenses.length) {
            this.totalPaidAmount = this.expenses.map((expense) => expense.amount)
              .reduce((accumulator, current) => accumulator + current);
          }
          this.expenseWithOwedAmounts = this.expenses.map((expense: Activity) => {
            return {
              id: expense._id,
              activityName: expense.activityName,
              activityDate: expense.activityDate,
              amount: expense.amount,
              paidBy: expense.paidBy,
              owedBy: expense.owedBy,
              details: expense.details,
              expensesWithOwedAmount: expense.owedBy.map((owedBy) => owedBy.firstName).includes('All') ?
                ((expense.amount / this.travelers.length) * (this.travelers.length - 1)) :
                (expense.owedBy.length > 1 && expense.owedBy.map((owedBy) => owedBy.firstName).includes(<string>this.selectedTraveler?.firstName) ?
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
