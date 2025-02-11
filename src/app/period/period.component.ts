import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { PeriodService } from '../period.service';
import { FormsModule, NgModel } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'period',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, MatDatepickerModule, MatInputModule, FormsModule, CommonModule, MatIconModule],
  providers: [PeriodService],
  templateUrl: './period.component.html',
  styleUrl: './period.component.css'
})
export class PeriodComponent {

  sinceDate: Date;
  toDate: Date;

  constructor(public periodService: PeriodService, private datePipe: DatePipe, private router: Router, private cookieService: CookieService) { }

  onPeriod: any[];
  periodData: any;
  fechaSistema: Date;
  mesActual: number;
  añoActual: number;
  isWithinPeriod: boolean;

  async ngOnInit() {


    if (!this.cookieService.get('user_id')) {
      this.router.navigate(['/login']);
    }
    
    await this.periodService.loadPeriod(); // Espera a que los datos se carguen
    this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod

    this.obtenerFechaSistema();

    //alert(this.checkEscapeDisable())

        // Detect back navigation
    window.addEventListener('popstate', this.handleBackButton.bind(this));

  }

  obtenerFechaSistema(): void {
    this.fechaSistema = new Date();
    this.mesActual = this.fechaSistema.getMonth() + 1; // Los meses en JavaScript son 0-indexados, por eso sumamos 1 
    this.añoActual = this.fechaSistema.getFullYear();
}

checkDisable(): boolean {
  const start_current_period = this.onPeriod['start_current_period'];
  const end_current_period = this.onPeriod['end_current_period'];

  // Verificar si las fechas del período son válidas
  if (start_current_period && end_current_period) {
      return !this.isDateAfterPeriod(end_current_period);
  }

  // Si no hay fechas válidas, devolver verdadero para deshabilitar los botones
  return true;
}

isDateAfterPeriod(end_current_period: string): boolean {
  const currentDate = new Date();
  const endDate = new Date(end_current_period);

  // Verificar si la fecha actual es mayor a la fecha de fin del período
  return currentDate > endDate;
}


checkEscapeDisable(): boolean {
  const max_date = this.onPeriod['max_date'];

  // Verificar si las fechas del período son válidas
  if (max_date) {
      return !this.isDateAfterPeriod(max_date);
  }

  // Si no hay fechas válidas, devolver verdadero para deshabilitar los botones
  return true;
}


  async AddPeriod() {
    const fechaFormateada1 = this.datePipe.transform(this.sinceDate, 'yyyy-MM-dd');
    const fechaFormateada2 = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
    const ano1 = this.datePipe.transform(this.sinceDate, 'yyyy');
    const ano2 = this.datePipe.transform(this.toDate, 'yyyy');
    const name = ano1 + '-' + ano2;

    const swal = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swal.fire({
      title: "¿Estás Seguro?",
      text: "Una vez creado el período no se podrá eliminar ni modificar el período, ¡Revisa bien!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, estoy seguro",
      cancelButtonText: "¡No, cancélalo!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        const datos = {
          SendPeriodData: "",
          name: name,
          sinceDate: fechaFormateada1,
          toDate: fechaFormateada2
        };

        await fetch('http://localhost/jfb_rest_api/server.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        })
          .then(response => response.json())
          .then(data => {
            if (data.message === 'ok') {
              swal.fire({
                title: "¡Período Creado!",
                text: "El nuevo período escolar ha sido establecido.",
                icon: "success"
              });
              this.goToDashboard()
            } else {
              Swal.fire({
                title: "Error",
                text: data.message,
                icon: "error"
              });
            }
          })
          .catch(error => {
            console.error('Error:', error);
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error al agregar el período.",
              icon: "error"
            });
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swal.fire({
          title: "Cancelado",
          text: "Estate seguro la próxima vez, sonso",
          icon: "error"
        });
      }
    });
  }

  goToLogin() {
    this.cookieService.delete('user_id', '/');
    this.cookieService.delete('isAdmin', '/');
    this.cookieService.delete('person_id', '/');
    this.router.navigate(['/login']);
  }

  goToDashboard() {
    this.router.navigate(['/app/dashboard']);
  }

  readCookie() {
    return this.cookieService.get('isAdmin');
  }

  checkAdminCookie(): void {
    const isCookiePresent = this.cookieService.check('isAdmin');
  }


  isAdmin(): boolean {
    return this.cookieService.get('isAdmin') === '1'
  }

  handleBackButton(event: PopStateEvent) {
    this.goToLogin();
  }

}
