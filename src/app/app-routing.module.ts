import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ReportExpensesComponent} from './report-expenses/report-expenses.component';
import {OwedByComponent} from './report-expenses/owed-by/owed-by.component';
import {PaidByComponent} from './report-expenses/paid-by/paid-by.component';
import {PaidByAndOwedByComponent} from './report-expenses/paid-by-and-owed-by/paid-by-and-owed-by.component';
import {DisplayExpenseComponent} from './report-expenses/display-expense/display-expense.component';
import {DisplayAllExpensesComponent} from './report-expenses/display-all-expenses/display-all-expenses.component';
import {DisplayZiplineVideoComponent} from './report-expenses/display-zipline-video/display-zipline-video.component';

const routes: Routes = [
  { path: '', component: ReportExpensesComponent},
  { path: 'owed-by/:traveler', component: OwedByComponent },
  { path: 'paid-by/:traveler', component: PaidByComponent },
  { path: 'paid-by-and-owed-by/:traveler', component: PaidByAndOwedByComponent },
  { path: 'display-expense/:id', component: DisplayExpenseComponent },
  { path: 'display-all-expenses', component: DisplayAllExpensesComponent },
  { path: 'zipline', component: DisplayZiplineVideoComponent },
  { path: '**', component: ReportExpensesComponent },  // Wildcard route for a home page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
