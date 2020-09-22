import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerComponent } from './lister.component';

describe('ListerComponent', () => {
  let component: ListerComponent;
  let fixture: ComponentFixture<ListerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
