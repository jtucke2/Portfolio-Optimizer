import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingUsersComponent } from './pending-users.component';

describe('PendingUsersComponent', () => {
  let component: PendingUsersComponent;
  let fixture: ComponentFixture<PendingUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
