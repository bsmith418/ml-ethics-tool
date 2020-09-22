import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyCardComponent } from './strategy-card.component';

describe('StrategyCardComponent', () => {
  let component: StrategyCardComponent;
  let fixture: ComponentFixture<StrategyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategyCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
