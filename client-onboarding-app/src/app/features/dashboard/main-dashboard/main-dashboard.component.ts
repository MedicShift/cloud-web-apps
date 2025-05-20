import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { OnboardHospitalDialogComponent } from '../../onboard-hospital-dialog/onboard-hospital-dialog.component'; // Update path as needed

@Component({
  selector: 'app-main-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatDialogModule,
    OnboardHospitalDialogComponent
  ],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.css'
})
export class MainDashboardComponent {
  constructor(private dialog: MatDialog) {}

  openOnboardDialog(): void {
    const dialogRef = this.dialog.open(OnboardHospitalDialogComponent, {
      width: '500px',
      data: {} // You can pass data here if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog result:', result);
        // You can handle the result here (e.g., submit to backend)
      }
    });
  }
}
