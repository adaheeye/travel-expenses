import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivityService} from './activity.service';
import {Activity} from './activity.model';
import {Router} from '@angular/router';
import {ExpenseModalComponent} from "./expense-modal/expense-modal.component";
import { Overlay } from '@angular/cdk/overlay';
import {MatDialog} from "@angular/material/dialog";
import {take, takeUntil} from "rxjs/operators";
import {mergeMap, of, Subject} from "rxjs";
import {TravelerModalComponent} from "./traveler-modal/traveler-modal.component";
import {Traveler} from "./traveler.model";
import {AppService} from "./app.service";
import {TravelerService} from "./traveler.service";
import {TitleCasePipe} from "@angular/common";
import {YesOrNoDialogComponent} from "./yes-or-no-dialog/yes-or-no-dialog.component";

@Component({
  selector: 'report-expenses',
  templateUrl: './report-expenses.component.html',
  styleUrls: ['./report-expenses.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class ReportExpensesComponent implements OnInit, OnDestroy {
  public activities: Activity[] = [];
  public travelers: Traveler[] = []
  public selectedPaidBy: Traveler | null = null;
  public selectedOwedBy: Traveler | null = null;
  public selectedBothPaidByAndOwedBy: Traveler | null = null;
  public isPayeeExcluded = true;
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(private activityService: ActivityService,
              private _router: Router,
              private matDialog: MatDialog,
              private travelerService: TravelerService,
              private titleCasePipe: TitleCasePipe,
              private appService: AppService,
              private overlay: Overlay) { }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public load(): void {
    this.travelerService.getTravelers()
      .pipe(takeUntil(this.ngUnsubscribe),
        mergeMap((travelers: Traveler[]) => {
          console.log('travelers: ', travelers);
          this.travelers = travelers.map((traveler) => {
            traveler.firstName = this.titleCasePipe.transform(traveler.firstName);
            traveler.lastName = this.titleCasePipe.transform(traveler.lastName);
            return traveler;
          });
          return this.activityService.getActivities()
        }))
      .subscribe((activities: Activity[]) => {
        console.log('activities: ', activities);
        if (activities) {
          if (this.isPayeeExcluded) {
            this.activities = /*ExcludePayeeUtil.getExpenses(activities)*/ activities; // TODO enable later.
          } else {
            this.activities = activities;
          }
        }
      });
  }

  public navigateToPaidByPage(): void {
    this._router.navigate(['paid-by', this.selectedPaidBy], { replaceUrl: true }).then();
  }

  public navigateToOwedByPage(): void {
    this._router.navigate(['owed-by', this.selectedOwedBy], { replaceUrl: true }).then();
  }

  public navigateToBothPaidAndOwedPage(): void {
    if (this.selectedPaidBy === this.selectedOwedBy) {
      this._router.navigate(['paid-by-and-owed-by', this.selectedBothPaidByAndOwedBy], { replaceUrl: true }).then();
    }
  }

  public navigateToDisplayAllPage(): void {
    this._router.navigate(['display-all-expenses'], { replaceUrl: true }).then();
  }

  public addTraveler(): void {
    const dialog = this.matDialog.open(TravelerModalComponent,
      {
        height: '900px',
        width: '1200px',
        hasBackdrop: true,
        data: {travelers: this.travelers},
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        panelClass: 'mat-dialog-container-visible'
      });
    dialog.afterClosed().pipe(take(1),
      takeUntil(this.ngUnsubscribe),
      mergeMap((newTravelers) => {
        console.log('travelers: ', newTravelers);
        if (!newTravelers.length) {
          return of([]);
        }
        this.travelers = [...this.travelers, ...newTravelers];
        return this.travelerService.createMany(newTravelers)
      }))
      .subscribe((newTravelers) => {
        console.log('travelers: ', newTravelers);
      });
  }

  public getOwedBy(owedBy: Traveler[]): string {
    return owedBy.map((oB) => this.titleCasePipe.transform(oB.firstName)).join(', ');
  }

  viewActivity(id: string | undefined): void {
    this._router.navigate([`display-expense/${id}`], { replaceUrl: true }).then();
  }

  public addActivity(): void {
    const dialog = this.matDialog.open(ExpenseModalComponent,
      {
        height: '900px',
        width: '1200px',
        hasBackdrop: true,
        data: {expense: null, travelers: this.travelers},
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        panelClass: 'mat-dialog-container-visible'
      });
    dialog.afterClosed().pipe(take(1),
      takeUntil(this.ngUnsubscribe),
      mergeMap((event: CustomEvent) => {
        if (!!event && event.detail && event.detail.newActivities?.length) {
          return this.activityService.createMany(event.detail.newActivities);
        }
        return of([]);
      }))
      .subscribe((activities) => {
        if (activities?.length) {
          activities = activities.map((newActivity) => {
            newActivity.paidBy = this.travelers.find((t) => t._id === newActivity.paidBy._id) || newActivity.paidBy;
            newActivity.owedBy = this.travelers.filter((t) => newActivity.owedBy.map((oB) => oB._id).includes(t._id));
            return newActivity;
          })
          this.activities = [...this.activities, ...activities]
        }
        console.log('activities: ',activities)
      });
  }

  editActivity(activity: Activity): void {
    const dialog = this.matDialog.open(ExpenseModalComponent,
      {
        height: '900px',
        width: '1200px',
        hasBackdrop: true,
        data: {expense: activity, travelers: this.travelers},
        scrollStrategy: this.overlay.scrollStrategies.noop(),
        panelClass: 'mat-dialog-container-visible'
      });
    dialog.afterClosed().pipe(take(1),
      takeUntil(this.ngUnsubscribe),
      mergeMap((event: CustomEvent) => {
        if (!!event && event.detail && event.detail.updatedActivity) {
          return this.activityService.update(event.detail.updatedActivity)
        }
        return of(null);
      }))
      .subscribe((activity: Activity | null) => {
        console.log('activity: ', activity)
        if (activity) {
          const indexToReplace = this.activities.findIndex(act => act._id === activity._id);
          if (indexToReplace !== -1) {
            this.activities[indexToReplace] = activity;
          }
        }
      });

  }
  deleteActivity(activity: Activity): void {
    const dialog = this.matDialog.open(YesOrNoDialogComponent, {
      width: '400px',
      data: {
        labelMessage: 'Deleting activity',
        message: 'Are you sure you want to delete this activity ?'
      }
    });
    dialog.afterClosed().pipe(take(1),
      takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      if (value && activity?._id) {
        this.activityService.delete(activity._id)
          .pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            const index = this.activities.indexOf(activity);
            this.activities.splice(index, 1);
        });
      }
    })
  }
}
