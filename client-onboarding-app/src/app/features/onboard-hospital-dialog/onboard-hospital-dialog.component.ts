import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-onboard-hospital-dialog',
  templateUrl: './onboard-hospital-dialog.component.html',
  imports:[CommonModule,FormsModule],
  styleUrls: ['./onboard-hospital-dialog.component.css']
})
export class OnboardHospitalDialogComponent {
  hospital = {
    name: '',
    email: '',
    address: '',
    contact: '',
    status:''
  };

  constructor(public dialogRef: MatDialogRef<OnboardHospitalDialogComponent>) {}

  submitForm() {
    if (this.hospital.name && this.hospital.email && this.hospital.address && this.hospital.contact) {
      console.log('Hospital Data:', this.hospital);
      this.dialogRef.close(this.hospital);
    }
  }
}
