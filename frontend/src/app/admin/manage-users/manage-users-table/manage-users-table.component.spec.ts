import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUsersTableComponent } from './manage-users-table.component';

describe('ManageUsersTableComponent', () => {
  let component: ManageUsersTableComponent;
  let fixture: ComponentFixture<ManageUsersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageUsersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUsersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
