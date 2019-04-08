import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobViewerComponent } from './job-viewer.component';

describe('JobViewerComponent', () => {
  let component: JobViewerComponent;
  let fixture: ComponentFixture<JobViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
