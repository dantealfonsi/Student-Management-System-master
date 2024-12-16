import { Component,computed,signal,OnInit} from '@angular/core';
import { MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CustomSidenavComponent } from '../custom-sidenav/custom-sidenav.component';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from "@angular/common";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CookieService } from 'ngx-cookie-service';
import { PeriodService } from '../period.service';


@Component({
  selector: 'sidenav',
  standalone: true,
  imports: [CommonModule,MatToolbarModule,MatIconModule,MatButtonModule,MatSidenavModule,CustomSidenavComponent,RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css',
  animations: [
    trigger('enterAnimation', [
        transition(':enter', [
            style({ transform: 'translateY(100%)', opacity: 0 }),
            animate('500ms', style({ transform: 'translateY(0)', opacity: 1 }))
        ]),
        transition(':leave', [
            style({ transform: 'translateY(0)', opacity: 1 }),
            animate('500ms', style({ transform: 'translateY(100%)', opacity: 0 }))
        ])
    ]),
    trigger('widthChange', [ state('collapsed', 
      style({ width: 'calc(100% - 65px)', left: '65px' })), 
      state('expanded', style({ width: 'calc(100% - 250px)', left: '250px' })), 
      transition('collapsed <=> expanded', [ animate('400ms ease-in-out') ]) ])
],
})
export class SidenavComponent {

  onPeriod: any[];
  toolbarWidth: any;
  tooBarLeft: any;
  sidenavWidth: any;
  collapsed: any;

  constructor(private cookieService: CookieService,private router: Router,public periodService: PeriodService) {};

  async ngOnInit(): Promise<void> {

      // Verificar si la cookie está presente
    if (!this.cookieService.get('user_id')) {
      // Redirigir al componente de inicio de sesión
      this.router.navigate(['/login']);
    }

    await this.periodService.loadPeriod(); // Espera a que los datos se carguen
    this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod
    
    if(this.onPeriod['exist_period']===false){
      this.cookieService.delete('user_id');
      this.cookieService.delete('isAdmin');
      this.router.navigate(['/login']);
    }

    this.updateLayout()
    window.addEventListener('resize', this.updateLayout.bind(this)); // Añadir listener para cambios en la resolución

  }
  
logout() {
  this.cookieService.delete('user_id');
  this.cookieService.delete('isAdmin');
  this.router.navigate(['/login']);
}

/*******************UPDATE LAYOUT WITH RESPONSIVE**************************** */

updateLayout() {
  
  const isNarrowScreen = window.innerWidth < 950;

  if (!isNarrowScreen){
    this.collapsed = signal(false);
  } else{
    this.collapsed = signal(true);
  }

  this.sidenavWidth = computed(() => {
    return isNarrowScreen ? (this.collapsed() ? '0px' : '100%') : (this.collapsed() ? '65px' : '250px');
  });

  this.tooBarLeft = computed(() => {
    return isNarrowScreen ? (this.collapsed() ? '0px !important' : '0px !important') : (this.collapsed() ? '65px' : '250px');
  });

  this.toolbarWidth = computed(() => {
    return isNarrowScreen ? (this.collapsed() ? '100% !importan' : '100% !importan') : (this.collapsed() ? 'calc(100% - 65px)' : 'calc(100% - 250px)');
  });
}

/*******************UPDATE LAYOUT WITHOUT RESPONSIVE**************************** */

  
  //collapsed = signal(false);
  /*
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  tooBarLeft =  computed(() => this.collapsed() ? '65px' : '250px');
  toolbarWidth = computed(() => this.collapsed() ? 'calc(100% - 65px)' : 'calc(100% - 250px)');
*/


/******************* END UPDATE LAYOUT**************************** */

  
  show: boolean = false;

  openToggle() {
    this.show = true;
  }

  closeToggle() {
    this.show = false;
  }

  
  isDateWithinPeriod(start_current_period: string, end_current_period: string): boolean {
    const currentDate = new Date();
    const startDate = new Date(start_current_period);
    const endDate = new Date(end_current_period);
  
    console.log(currentDate+"-"+startDate+"-"+endDate);

    return currentDate >= startDate && currentDate <= endDate;
    
  }
  
  

}




