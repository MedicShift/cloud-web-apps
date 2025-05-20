import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardHospitalDialogComponent } from './onboard-hospital-dialog.component';

describe('OnboardHospitalDialogComponent', () => {
  let component: OnboardHospitalDialogComponent;
  let fixture: ComponentFixture<OnboardHospitalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardHospitalDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardHospitalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
