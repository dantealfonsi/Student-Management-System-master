import { Component,computed,signal } from '@angular/core';
import { MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSidenavComponent } from '../custom-sidenav/custom-sidenav.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'sidenav',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,MatButtonModule,MatSidenavModule,CustomSidenavComponent,RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {

  collapsed = signal(false);
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');


}
