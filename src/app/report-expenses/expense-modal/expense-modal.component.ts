import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Activity} from "../activity.model";
import {Traveler} from "../traveler.model";
import {TitleCasePipe} from "@angular/common";
import {YesOrNoDialogComponent} from "../yes-or-no-dialog/yes-or-no-dialog.component";
import {take, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";

@Component({
  selector: 'app-expense',
  templateUrl: './expense-modal.component.html',
  styleUrls: ['./expense-modal.component.scss']
})
export class ExpenseModalComponent implements OnInit, OnDestroy {
  public travelers: Traveler[] = [];
  public newActivities: Activity[] = [];
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(public dialogRef: MatDialogRef<ExpenseModalComponent>,
              private titleCasePipe: TitleCasePipe,
              private matDialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: {expense: Activity, travelers: Traveler[]}) {
    this.travelers = this.data.travelers;
  }
  expenseForm = new FormGroup({
    _id: new FormControl(null),
    activityName: new FormControl('', [Validators.required]),
    activityDate: new FormControl('', [Validators.required/*, this.dateNotInFutureValidator()*/]),
    amount: new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    paidBy: new FormControl(null, [Validators.required]),
    owedBy: new FormControl([], [Validators.required]),
    details: new FormControl('')
  });

  ngOnInit() {
    this.expenseForm.valueChanges.subscribe(activity => {
      if (activity && activity.paidBy && activity.owedBy) {
        if (activity.owedBy.includes(activity.paidBy)) {
          const index = activity.owedBy.indexOf(activity.paidBy);
          activity.owedBy.splice(index, 1);
          this.expenseForm.controls['owedBy'].patchValue(activity.owedBy);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  addActivity() {
    console.log('expenseForm.value: ', this.expenseForm.value);
    console.log('this.expenseForm.value: ', this.expenseForm.value);
    const newActivity = new Activity({
      activityName: this.expenseForm.value.activityName,
      activityDate: this.expenseForm.value.activityDate,
      amount: this.expenseForm.value.amount,
      paidBy: new Traveler({
        _id: this.expenseForm.value.paidBy
      }),
      owedBy: this.getOwedByArray(),
      details: this.expenseForm.value.details,
    });
    newActivity.paidBy = this.travelers.find((t) => t._id === newActivity.paidBy._id) || newActivity.paidBy;
    newActivity.owedBy = this.travelers.filter((t) => newActivity.owedBy.map((oB) => oB._id).includes(t._id));
    console.log('newActivity.owedBy: ', newActivity.owedBy);
    this.newActivities.push(newActivity);
    this.expenseForm.reset();
  }

  getOwedBy(owedBy: Traveler[]): string {
    return owedBy.map((oB) => this.titleCasePipe.transform(oB.firstName)).join(', ');
  }

  getOwedByArray(): Traveler[] {
    const owedBy: Traveler[] = [];
    this.expenseForm.value?.owedBy?.forEach((oB) => {
      owedBy.push(new Traveler({
        _id: oB
      }))
    })
    return owedBy;
  }

  submit(): void {
    this.dialogRef.close(this.newActivities);
  }

  close(): void {
    if (this.newActivities.length) {
      const dialog = this.matDialog.open(YesOrNoDialogComponent, {
        width: '400px',
        data: {
          labelMessage: 'Un-submitted activity(ies)',
          message: 'You have un-submitted activity(ies). Do you want to discard them ?'
        }
      });
      dialog.afterClosed().pipe(take(1),
        takeUntil(this.ngUnsubscribe)).subscribe((value) => {
          if (value) {
            this.dialogRef.close();
          }
      })
    } else {
      this.dialogRef.close();
    }
  }

  private dateNotInFutureValidator(): any {
    return (control: FormControl): { [key: string]: any } | null => {
      const currentDate = new Date();
      const selectedDate = new Date(control.value);
      if (selectedDate > currentDate) {
        return { 'futureDate': true };
      } else {
        return null;
      }
    };
  }

}
