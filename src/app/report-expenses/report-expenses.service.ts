import {Injectable } from '@angular/core';
import {Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReportExpensesService {

  private readonly resourceUrl = './assets/expenses/expenses.json';

  constructor(private http: HttpClient) {
  }

  public getExpenses(): Observable<any> {
    return this.http.get(this.resourceUrl);
  }

}
