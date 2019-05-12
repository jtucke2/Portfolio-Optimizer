import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenamePortfolioDialogComponent } from './rename-portfolio-dialog.component';

describe('RenamePortfolioDialogComponent', () => {
  let component: RenamePortfolioDialogComponent;
  let fixture: ComponentFixture<RenamePortfolioDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenamePortfolioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenamePortfolioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
