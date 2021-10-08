import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidByComponent } from './paid-by.component';

describe('PaidByComponent', () => {
  let component: PaidByComponent;
  let fixture: ComponentFixture<PaidByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidByComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
