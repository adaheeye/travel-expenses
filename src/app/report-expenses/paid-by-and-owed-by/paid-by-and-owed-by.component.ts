import {Component, OnDestroy, OnInit} from '@angular/core';
import {TravelerEnum} from '../util/travelerEnum';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';

@Component({
  selector: 'paid-by-and-owed-by',
  templateUrl: './paid-by-and-owed-by.component.html',
  styleUrls: ['./paid-by-and-owed-by.component.scss']
})
export class PaidByAndOwedByComponent implements OnInit, OnDestroy {
  public amountToReturn: number = 0;
  public expensesWithOwedAmountEventFromPaidByComp: number = 0;
  public expensesWithOwedAmountEventFromOwedByComp: number = 0;
  public selectedTraveler: string | null = '';
  private isExpensesWithOwedAmountEventFromPaidByCompSet = false;
  private isExpensesWithOwedAmountEventFromOwedByCompSet = false;
  private travelers: string[] = [];
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.travelers = [...Object.values(TravelerEnum)];
    this.route.paramMap.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((paramMap) => {
      this.selectedTraveler = paramMap.get('traveler');
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public onChange(expensesWithOwedAmountEvent: number, type: string): void {
    if (type === 'paidBy') {
      this.expensesWithOwedAmountEventFromPaidByComp = expensesWithOwedAmountEvent;
      this.isExpensesWithOwedAmountEventFromPaidByCompSet = true;
    } else if (type === 'owedBy') {
      this.expensesWithOwedAmountEventFromOwedByComp = expensesWithOwedAmountEvent;
      this.isExpensesWithOwedAmountEventFromOwedByCompSet = true;
    }

    if (this.isExpensesWithOwedAmountEventFromPaidByCompSet && this.isExpensesWithOwedAmountEventFromOwedByCompSet) {
      this.amountToReturn = this.expensesWithOwedAmountEventFromPaidByComp - this.expensesWithOwedAmountEventFromOwedByComp;
    }
  }


}
