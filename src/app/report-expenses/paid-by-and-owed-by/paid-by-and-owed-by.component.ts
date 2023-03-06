import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {mergeMap, of, Subject} from 'rxjs';
import {Traveler} from "../traveler.model";
import {AppService} from "../app.service";
import {TravelerService} from "../traveler.service";

@Component({
  selector: 'paid-by-and-owed-by',
  templateUrl: './paid-by-and-owed-by.component.html',
  styleUrls: ['./paid-by-and-owed-by.component.scss']
})
export class PaidByAndOwedByComponent implements OnInit, OnDestroy {
  public amountToReturn: number = 0;
  public expensesWithOwedAmountEventFromPaidByComp: number = 0;
  public expensesWithOwedAmountEventFromOwedByComp: number = 0;
  public selectedTraveler: Traveler | null = null;
  private isExpensesWithOwedAmountEventFromPaidByCompSet = false;
  private isExpensesWithOwedAmountEventFromOwedByCompSet = false;
  private travelers: Traveler[] = [];
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute,
              private travelerService: TravelerService,
              private appService: AppService) { }

  ngOnInit(): void {
    this.travelerService.getTravelers()
      .pipe(takeUntil(this.ngUnsubscribe),
        mergeMap((travelers: Traveler[]) => {
          this.travelers = travelers
          return this.route.paramMap;
        }),
        mergeMap((paramMap) => {
          console.log(paramMap.get('travelerId'));
          if (paramMap.get('travelerId')) {
            return this.travelerService.findById(Number(paramMap.get('travelerId')))
          } else {
            return of(null)
          }
        }))
      .subscribe((traveler: Traveler | null) => {
        console.log('traveler: ', traveler);
        this.selectedTraveler = traveler;
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
