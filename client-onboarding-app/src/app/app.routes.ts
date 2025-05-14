import { Routes } from '@angular/router';
import { RouteNames } from './core/constants';
import { MainDashboardComponent } from './features/dashboard/main-dashboard/main-dashboard.component';
import { SideBarComponent } from './layout/components/side-bar/side-bar.component';

export const routes: Routes = [
  {
    path: '',
    component: SideBarComponent,
    children: [
      { path: RouteNames.MainDashboard, component: MainDashboardComponent },
    ],
  },
  // { path: '**', redirectTo: '' },
];
