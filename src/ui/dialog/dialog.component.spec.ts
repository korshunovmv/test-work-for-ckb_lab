import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { DialogOverviewComponent } from './dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material';

describe('DialogOverviewComponent', () => {
  let component: DialogOverviewComponent;
  let fixture: ComponentFixture<DialogOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOverviewComponent ],
      imports: [ MatDialogModule ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {}
        }, {
          provide: MAT_DIALOG_DATA,
          useValue: {} // Add any data you wish to test if it is passed/used correctly
        }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
