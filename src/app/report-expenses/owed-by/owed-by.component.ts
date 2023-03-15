import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Activity} from '../activity.model';
import {mergeMap, of, Subject} from 'rxjs';
import {ActivityService} from '../activity.service';
import {ActivatedRoute, Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
import {ExpenseWithOwedAmount} from '../expenseWithOwedAmaount.model';
import {Traveler} from "../traveler.model";
import {AppService} from "../app.service";
import {TravelerService} from "../traveler.service";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'owed-by',
  templateUrl: './owed-by.component.html',
  styleUrls: ['./owed-by.component.scss']
})
export class OwedByComponent implements OnInit, OnDestroy {
  @Input() public passToComponent: boolean = false;
  @Output() expensesWithOwedAmountEvent: EventEmitter<any> = new EventEmitter();
  public expenses: Activity[] = [];
  public expensesWithOwedAmount: ExpenseWithOwedAmount[] = [];
  public name: any;
  public selectedTraveler: Traveler | null = null;
  public totalExpensesWithOwedAmount: number = 0;
  private travelers: Traveler[] = []
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private reportExpensesService: ActivityService,
              private travelerService: TravelerService,
              private titleCasePipe: TitleCasePipe,
              private appService: AppService,
              private route: ActivatedRoute,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.travelerService.getTravelers()
      .pipe(takeUntil(this.ngUnsubscribe),
        mergeMap((travelers: Traveler[]) => {
          this.travelers = travelers
          return this.route.paramMap;
        }),
        mergeMap((paramMap) => {
          console.log(paramMap.get('travelerId'));
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
    this._router.navigate(['display-expense', expense.id], {replaceUrl: true}).then();
  }

  public getOwedBy(owedBy: Traveler[]): string {
    return owedBy.map((oB) => this.titleCasePipe.transform(oB.firstName)).join(', ');
  }

  private getExpenses() {
    this.reportExpensesService.getActivities()
      .subscribe((activities: Activity[]) => {
        if (!!activities.length) {
          this.expenses = activities;
          this.expenses = this.expenses.filter((expense) => expense.paidBy.firstName !== this.selectedTraveler?.firstName &&
            (expense.owedBy?.map((owedBy) => owedBy.firstName).includes('All') || expense.owedBy?.map((owedBy) => owedBy.firstName).includes(this.selectedTraveler?.firstName as string | '')));
          this.expensesWithOwedAmount = this.expenses.map((expense: Activity) => {
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
