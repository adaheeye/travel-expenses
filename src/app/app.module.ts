import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReportExpensesComponent } from './report-expenses/report-expenses.component';
import { ReportExpensesService } from "./report-expenses/report-expenses.service";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { OwedByComponent } from './report-expenses/owed-by/owed-by.component';
import { PaidByComponent } from './report-expenses/paid-by/paid-by.component';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { PaidByAndOwedByComponent } from './report-expenses/paid-by-and-owed-by/paid-by-and-owed-by.component';
import { DisplayExpenseComponent } from './report-expenses/display-expense/display-expense.component';
import { DisplayAllExpensesComponent } from './report-expenses/display-all-expenses/display-all-expenses.component';
import { DisplayZiplineVideoComponent } from './report-expenses/display-zipline-video/display-zipline-video.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ReportExpensesComponent,
    OwedByComponent,
    PaidByComponent,
    PaidByAndOwedByComponent,
    DisplayExpenseComponent,
    DisplayAllExpensesComponent,
    DisplayZiplineVideoComponent,
    FooterComponent
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
  ],
  providers: [ReportExpensesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
