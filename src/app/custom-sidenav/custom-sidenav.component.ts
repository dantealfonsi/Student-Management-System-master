import { CommonModule } from '@angular/common';
import { Component,signal,computed, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';

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

    sideNavCollapsed = signal(false);
item: any;

    @Input() set collapsed(val: boolean) {
      this.sideNavCollapsed.set(val);
    } 

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'inicio',
      route: 'dashboard'
    },
    {
      icon: 'face',
      label: 'Estudiantes',
      subItems: [
        {
          icon: 'library_add',
          label: 'Inscribir Estudiante',
          route: 'addStudent'
        },
        {
          icon: 'mail',
          label: 'Lista de Inscripciones',
          route: 'viewRegistration'
        },
        {
          icon: 'list_alt',
          label: 'Lista de Estudiantes',
          route: 'viewStudent'
        },

      ]
    },
    {
      icon: 'contact_phone',
      label: 'Representantes',
      route: 'viewParent'
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
        {
          icon: 'list_alt',
          label: 'Ver Periodos',
        },
      ]
    },
    {
      icon: 'supervised_user_circle',
      label: 'Usuarios',
      route: 'viewUsers'
    },
    {
      icon: 'class',
      label: 'Secciones',
      route: 'viewSection'
    },
    {
      icon: 'analytics',
      label: 'Reportes',
      route: ''
    },
  ])
  
  profilePicSize = computed(() => this.sideNavCollapsed() ? '60' : '120');
}
