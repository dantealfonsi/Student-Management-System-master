import { CommonModule } from '@angular/common';
import { Component, signal, computed, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { CookieService } from 'ngx-cookie-service';
import { PeriodService } from '../period.service';
import Swal from 'sweetalert2';

export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subItems?: MenuItem[];
}
@Component({
  selector: 'custom-sidenav',
  standalone: true,
  templateUrl: './custom-sidenav.component.html',
  styleUrl: './custom-sidenav.component.css',
  imports: [CommonModule, MatListModule, MatIconModule, RouterLink, RouterModule, MenuItemComponent]
})

export class CustomSidenavComponent {

  constructor(private cookieService: CookieService, public periodService: PeriodService) { }

  onPeriod: any[];

  sideNavCollapsed = signal(false);
  item: any;
  

  async ngOnInit() {
    await this.periodService.loadPeriod(); // Espera a que los datos se carguen
    this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod
  }

  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val);
  }
  
   blockClosePeriod() {
    return this.onPeriod['last_period_still_open'] === true;
  }

  menuItems = signal<MenuItem[]>([
    
    {
      icon: 'dashboard',
      label: 'Inicio',
      route: 'dashboard'
    },

    {
      icon: 'face',
      label: 'Estudiantes',
      route: 'viewStudent'
    },

    {
      icon: 'contact_phone',
      label: 'Representantes',
      route: 'viewParent'
    },
    {
      icon: 'class',
      label: 'Secciones',
      route: 'viewSection'
    },
    {
      icon: 'recent_actors',
      label: 'Profesores',
      route: 'viewTeacher'
    },
    {
      icon: 'subject',
      label: 'Materias',
      route: 'viewSubject'
    },
    {
      icon: 'supervised_user_circle',
      label: 'Usuarios',
      route: 'viewUsers'
    },
    {
      icon: 'assignment',
      label: 'Reportes',
      route: 'reports'
    },
  ])


  menuItemsUser = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Inicio',
      route: 'dashboard'
    },

    {
      icon: 'face',
      label: 'Estudiantes',
      route: 'viewStudent'
    },

    {
      icon: 'contact_phone',
      label: 'Representantes',
      route: 'viewParent'
    },
    {
      icon: 'class',
      label: 'Secciones',
      route: 'viewSection'
    },
    {
      icon: 'recent_actors',
      label: 'Profesores',
      route: 'viewTeacher'
    },
    {
      icon: 'subject',
      label: 'Materias',
      route: 'viewSubject'
    },
    {
      icon: 'assignment',
      label: 'Reportes',
      route: 'reports'
    },
  ])

  profilePicSize = computed(() => this.sideNavCollapsed() ? '60' : '120');

  readCookie() {
    return this.cookieService.get('isAdmin');
  }

  closeLastPeriod() {
    const datos = {
      closePeriod: "",
      periodId: this.onPeriod['last_period_id'] // Asegúrate de que lastPeriod esté definido e inicializado en tu componente
    };
  
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Estás a punto de cerrar el último periodo. Esta acción no puede deshacerse.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          fetch('http://localhost/jfb_rest_api/server.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
          })
            .then(response => response.json())
            .then(data => {
              Swal.fire({
                title: 'Periodo cerrado!',
                text: 'El último periodo ha sido cerrado con éxito.',
                icon: 'success'
              });
              location.reload();
            })
            .catch(error => {
              console.error('Error:', error);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire({
            title: 'Operación cancelada',
            text: 'El último anterior periodo no ha sido cerrado.',
            icon: 'error'
          });
        }
      });
  }
  


}


