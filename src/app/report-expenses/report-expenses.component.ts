import {Component, OnInit} from '@angular/core';
import {ReportExpensesService} from './report-expenses.service';
import {Expense} from './expense.model';
import {TravelerEnum} from './util/travelerEnum';
import {Router} from '@angular/router';

@Component({
  selector: 'report-expenses',
  templateUrl: './report-expenses.component.html',
  styleUrls: ['./report-expenses.component.scss']
})
export class ReportExpensesComponent implements OnInit {
  public expenses: Expense[] = [];
  public travelers: string[] = []
  public selectedPaidBy: TravelerEnum | string = '';
  public selectedOwedBy: TravelerEnum | string = '';
  public selectedBothPaidByAndOwedBy: TravelerEnum | string = '';

  constructor(private reportExpensesService: ReportExpensesService, private _router: Router) { }

  ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.travelers = ['', ...Object.values(TravelerEnum)];
    this.reportExpensesService.getExpenses()
      .subscribe((activities: Expense[]) => {
        if (!!activities) {
          this.expenses  = activities;
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
}
