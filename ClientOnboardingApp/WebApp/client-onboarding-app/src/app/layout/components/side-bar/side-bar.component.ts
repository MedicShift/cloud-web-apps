import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  imports: [RouterOutlet],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  constructor(private router: Router) {} 
  
  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
