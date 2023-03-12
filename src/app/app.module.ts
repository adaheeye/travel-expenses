import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReportExpensesComponent } from './report-expenses/report-expenses.component';
import { ActivityService } from "./report-expenses/activity.service";
import { HttpClientModule } from '@angular/common/http';
import {CommonModule, TitleCasePipe} from '@angular/common';
import { OwedByComponent } from './report-expenses/owed-by/owed-by.component';
import { PaidByComponent } from './report-expenses/paid-by/paid-by.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { PaidByAndOwedByComponent } from './report-expenses/paid-by-and-owed-by/paid-by-and-owed-by.component';
import { DisplayExpenseComponent } from './report-expenses/display-expense/display-expense.component';
import { DisplayAllExpensesComponent } from './report-expenses/display-all-expenses/display-all-expenses.component';
import { FooterComponent } from './footer/footer.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ExpenseModalComponent } from './report-expenses/expense-modal/expense-modal.component';
import {MatInputModule} from "@angular/material/input";
import { MatDialogModule } from '@angular/material/dialog';
import { TravelerModalComponent } from './report-expenses/traveler-modal/traveler-modal.component';
import {MatListModule} from "@angular/material/list";
import {AppService} from "./report-expenses/app.service";
import {TravelerService} from "./report-expenses/traveler.service";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {YesOrNoDialogComponent} from "./report-expenses/yes-or-no-dialog/yes-or-no-dialog.component";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {HeaderComponent} from "./header/header.component";



@NgModule({
  declarations: [
    AppComponent,
    ReportExpensesComponent,
    OwedByComponent,
    PaidByComponent,
    PaidByAndOwedByComponent,
    DisplayExpenseComponent,
    DisplayAllExpensesComponent,
    FooterComponent,
    HeaderComponent,
    ExpenseModalComponent,
    YesOrNoDialogComponent,
    TravelerModalComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatTooltipModule,
        MatButtonModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        MatInputModule,
        MatDialogModule,
        MatListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule,
        MatToolbarModule
    ],
  providers: [
    ActivityService,
    AppService,
    TravelerService,
    TitleCasePipe,
    // DateAdapter
  ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line to suppress the error
  bootstrap: [AppComponent]
})
export class AppModule { }
