import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectJobMsgComponent } from './select-job-msg.component';

describe('SelectJobMsgComponent', () => {
  let component: SelectJobMsgComponent;
  let fixture: ComponentFixture<SelectJobMsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectJobMsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectJobMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
