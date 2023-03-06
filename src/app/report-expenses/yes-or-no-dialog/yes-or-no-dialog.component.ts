import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'yes-or-no-dialog',
  templateUrl: './yes-or-no-dialog.component.html',
})
export class YesOrNoDialogComponent {

  constructor(public dialogRef: MatDialogRef<YesOrNoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { labelMessage: string, message: string }) {
  }

}
