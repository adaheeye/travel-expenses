import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwedByComponent } from './owed-by.component';

describe('OwedByComponent', () => {
  let component: OwedByComponent;
  let fixture: ComponentFixture<OwedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwedByComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
