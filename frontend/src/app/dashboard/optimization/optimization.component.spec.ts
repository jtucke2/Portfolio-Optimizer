import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptimizationComponent } from './optimization.component';

describe('OptimizationComponent', () => {
  let component: OptimizationComponent;
  let fixture: ComponentFixture<OptimizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptimizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
