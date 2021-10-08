import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayZiplineVideoComponent } from './display-zipline-video.component';

describe('DisplayZiplineVideoComponent', () => {
  let component: DisplayZiplineVideoComponent;
  let fixture: ComponentFixture<DisplayZiplineVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayZiplineVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayZiplineVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
