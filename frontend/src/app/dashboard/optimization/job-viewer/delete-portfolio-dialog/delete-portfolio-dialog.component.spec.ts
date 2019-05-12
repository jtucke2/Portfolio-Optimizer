import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePortfolioDialogComponent } from './delete-portfolio-dialog.component';

describe('DeletePortfolioDialogComponent', () => {
  let component: DeletePortfolioDialogComponent;
  let fixture: ComponentFixture<DeletePortfolioDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePortfolioDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePortfolioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
