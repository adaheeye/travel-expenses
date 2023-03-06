import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelerModalComponent } from './traveler-modal.component';

describe('TravelerModalComponent', () => {
  let component: TravelerModalComponent;
  let fixture: ComponentFixture<TravelerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
