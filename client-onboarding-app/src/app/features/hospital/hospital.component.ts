import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OnboardHospitalDialogComponent } from '../onboard-hospital-dialog/onboard-hospital-dialog.component';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent {
  hospitals = [
    {
      name: 'Memorial Regional Hospital',
      address: '123 Main St, Jacksonville, FL 32256',
      email: 'contact@memorialregional.com',
      phone: '(904) 555-1234',
      admins: 3,
      users: 28,
      status: 'Active'
    },
    {
      name: 'Northside Medical Center',
      address: '456 Peachtree St, Atlanta, GA 30308',
      email: 'info@northsidemedical.org',
      phone: '(470) 555-6789',
      admins: 2,
      users: 15,
      status: 'Active'
    },
    {
      name: 'Mercy Hospital',
      address: '789 Michigan Ave, Chicago, IL 60611',
      email: 'contact@mercyhospital.org',
      phone: '(312) 555-4567',
      admins: 5,
      users: 42,
      status: 'Active'
    },
    {
      name: 'East Valley Health',
      address: '101 Desert Blvd, Phoenix, AZ 85001',
      email: 'info@eastvalleyhealth.com',
      phone: '(602) 555-8910',
      admins: 1,
      users: 8,
      status: 'Onboarding'
    },
    {
      name: 'Ocean Medical Group',
      address: '202 Ocean Drive, Miami, FL 33139',
      email: 'contact@oceanmedical.com',
      phone: '(305) 555-5432',
      admins: 0,
      users: 0,
      status: 'Onboarding'
    },
    {
      name: 'Sunset General Hospital',
      address: '303 Pacific Hwy, San Diego, CA 92101',
      email: 'admin@sunsetgeneral.org',
      phone: '(619) 555-3344',
      admins: 0,
      users: 0,
      status: 'Inactive'
    }
  ];

  filteredHospitals = [...this.hospitals];
  selectedStatus = 'All';
  searchTerm = '';

  constructor(private dialog: MatDialog) {}

  openAddHospitalDialog(): void {
    const dialogRef = this.dialog.open(OnboardHospitalDialogComponent, {
      width: '400px',
      data: {}  // Optional: Pass initial data here
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.hospitals.push(result);
        this.filterHospitals();
      }
    });
  }

  filterHospitals(): void {
    this.filteredHospitals = this.hospitals.filter(hospital => {
      const matchesSearch = hospital.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All' || hospital.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  setStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.filterHospitals();
  }

  onSearchChange(): void {
    this.filterHospitals();
  }
}
