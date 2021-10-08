import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAllExpensesComponent } from './display-all-expenses.component';

describe('DisplayAllExpensesComponent', () => {
  let component: DisplayAllExpensesComponent;
  let fixture: ComponentFixture<DisplayAllExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayAllExpensesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAllExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
