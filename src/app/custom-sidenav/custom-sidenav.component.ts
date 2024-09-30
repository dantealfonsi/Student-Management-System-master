import { CommonModule } from '@angular/common';
import { Component,signal,computed, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { CookieService } from 'ngx-cookie-service';


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

  constructor(private cookieService: CookieService) {}

    sideNavCollapsed = signal(false);
item: any;

    @Input() set collapsed(val: boolean) {
      this.sideNavCollapsed.set(val);
    } 

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Inicio',
      route: 'dashboard'
    },

    {
      icon: 'border_color',
      label: 'Inscribir',
      route: 'addStudent',
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
      subItems:[
        {
          icon: 'border_color',
          label: 'Registrar Profesor',
          route: 'addTeacher',
        },
        {
          icon: 'border_color',
          label: 'Ver Profesores',
          route: 'viewTeacher'
        },
      ]
    },
    {
      icon: 'subject',
      label: 'Materias',
      route: 'viewSubject'
    },
    {
      icon: 'insert_invitation',
      label: 'Carga Horaria',
      route: 'workCharge'
    },
    {
      icon: 'date_range',
      label: 'Periodos',
      subItems: [
        {
          icon: 'note_add',
          label: 'Fechar Periodo',
          route: 'period'

        },
      ]
    },
    {
      icon: 'supervised_user_circle',
      label: 'Usuarios',
      route: 'viewUsers'

    },
    {
      icon: 'supervised_user_circle',
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
      icon: 'border_color',
      label: 'Inscribir',
      subItems: [
        {
          icon: 'library_add',
          label: 'Inscripciones',
          route: 'addStudent'
        },
        {
          icon: 'mail',
          label: 'Lista de Inscripcion',
          route: 'viewRegistration'
        },
      ]
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
      icon: 'date_range',
      label: 'Periodos',
      subItems: [
        {
          icon: 'note_add',
          label: 'Fechar Periodo',
          route: 'period'

        },
        
      ]
    },
    {
      icon: 'supervised_user_circle',
      label: 'Reportes',
      route: 'reports'
    },
  ])
  
  profilePicSize = computed(() => this.sideNavCollapsed() ? '60' : '120');


  readCookie(){
    return this.cookieService.get('isAdmin');
  }



}
