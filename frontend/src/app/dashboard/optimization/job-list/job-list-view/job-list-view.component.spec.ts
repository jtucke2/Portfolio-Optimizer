import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListViewComponent } from './job-list-view.component';

describe('JobListViewComponent', () => {
  let component: JobListViewComponent;
  let fixture: ComponentFixture<JobListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
