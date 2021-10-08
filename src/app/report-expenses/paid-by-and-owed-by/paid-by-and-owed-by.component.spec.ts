import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidByAndOwedByComponent } from './paid-by-and-owed-by.component';

describe('PaidByAndOwedByComponent', () => {
  let component: PaidByAndOwedByComponent;
  let fixture: ComponentFixture<PaidByAndOwedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidByAndOwedByComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidByAndOwedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
