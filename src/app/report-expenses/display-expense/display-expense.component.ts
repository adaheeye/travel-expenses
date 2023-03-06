import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {Activity} from '../activity.model';
import {ActivityService} from '../activity.service';
import {Traveler} from "../traveler.model";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'display-expense',
  templateUrl: './display-expense.component.html',
  styleUrls: ['./display-expense.component.scss']
})
export class DisplayExpenseComponent implements OnInit, OnDestroy {

  public expenses: Activity[] = [];
  public activity: Activity | undefined;
  private ngUnsubscribe: Subject<void> = new Subject();
  private id: string | null = '';

  constructor(private reportExpensesService: ActivityService,
              private titleCasePipe: TitleCasePipe,
              private route: ActivatedRoute) { }

  public ngOnInit(): void {
    this.route.paramMap.pipe(
      takeUntil(this.ngUnsubscribe)
    ).subscribe((paramMap) => {
      this.id = paramMap.get('id');
      this.getExpenses();
    });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  getOwedBy(owedBy: Traveler[]): string {
    return owedBy.map((oB) => this.titleCasePipe.transform((oB.firstName || '') + ' ' + (oB.lastName || ''))).join(', ');
  }

  private getExpenses() {
    this.reportExpensesService.getActivities()
      .subscribe((activities: Activity[]) => {
        if (!!activities.length) {
          this.expenses  = activities;
          if (!!this.id) {
            this.activity = this.expenses.find((expense: Activity) => expense._id === this.id);
          }
        }
      });
  }

}
