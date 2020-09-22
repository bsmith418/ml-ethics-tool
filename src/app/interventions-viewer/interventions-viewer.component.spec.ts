import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionsViewerComponent } from './interventions-viewer.component';

describe('InterventionsViewerComponent', () => {
  let component: InterventionsViewerComponent;
  let fixture: ComponentFixture<InterventionsViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventionsViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventionsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
