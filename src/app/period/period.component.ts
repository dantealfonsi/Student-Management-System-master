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


  async ngOnInit() {



    if (!this.cookieService.get('user_id')) {
      this.router.navigate(['/login']);
    }



    await this.periodService.loadPeriod(); // Espera a que los datos se carguen
    this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod
  }


  checkDisable() {
    //Makes Buttons go Disabled
    return this.onPeriod['exist_period'];
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
    this.cookieService.delete('user_id');
    this.cookieService.delete('isAdmin');
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
}
