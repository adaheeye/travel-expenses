import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportExpensesComponent } from './report-expenses.component';

describe('ReportExpensesComponent', () => {
  let component: ReportExpensesComponent;
  let fixture: ComponentFixture<ReportExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
