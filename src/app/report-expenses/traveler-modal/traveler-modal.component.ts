import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators, ValidatorFn, AbstractControl} from "@angular/forms";
import {Traveler} from "../traveler.model";
import {YesOrNoDialogComponent} from "../yes-or-no-dialog/yes-or-no-dialog.component";
import {take, takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
@Component({
  selector: 'app-traveler-modal',
  templateUrl: './traveler-modal.component.html',
  styleUrls: ['./traveler-modal.component.scss']
})
export class TravelerModalComponent implements OnDestroy {
  public travelers: Traveler[] = [];
  public newTravelers: Traveler[] = [];
  public travelerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, this.noDuplicateNamesValidator()]),
    lastName: new FormControl('', [this.noDuplicateNamesValidator()])
  });
  private ngUnsubscribe: Subject<void> = new Subject();

  constructor(public dialogRef: MatDialogRef<TravelerModalComponent>,
              private matDialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: {travelers: Traveler[]}) {
    this.travelers = this.data.travelers;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  addTraveler(): void {
    console.log(this.travelerForm.value);
    this.newTravelers.push(this.travelerForm.value as Traveler)
    this.travelers.push(this.travelerForm.value as Traveler);
    this.travelerForm.reset();
  }

  submit(): void {
    this.dialogRef.close(this.newTravelers);
  }

  close(): void{
    if (this.newTravelers.length) {
      const dialog = this.matDialog.open(YesOrNoDialogComponent, {
        width: '400px',
        data: {
          labelMessage: 'Un-submitted traveler(s)',
          message: 'You have un-submitted traveler(s). Do you want to discard them ?'
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

  private noDuplicateNamesValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (this.travelers.some(traveler =>
        traveler.firstName.toLowerCase() === control.value.toLowerCase() &&
        traveler?.lastName?.toLowerCase() === this.travelerForm.controls.lastName?.value?.toLowerCase())) {
        return { 'duplicateName': true };
      }

      if (this.travelers.some(traveler =>
        traveler?.lastName?.toLowerCase() === control.value.toLowerCase() &&
        traveler.firstName.toLowerCase() === this.travelerForm.controls.firstName?.value?.toLowerCase())) {
        return { 'duplicateName': true };
      }

      return null;
    };
}
}
