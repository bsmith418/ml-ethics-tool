import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInterventionDialogComponent } from './edit-intervention-dialog.component';

describe('EditInterventionDialogComponent', () => {
  let component: EditInterventionDialogComponent;
  let fixture: ComponentFixture<EditInterventionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInterventionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInterventionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
