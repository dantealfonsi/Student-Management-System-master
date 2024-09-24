import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { PeriodService } from '../period.service';
import { FormsModule, NgModel } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'period',
  standalone: true,
  imports: [MatFormFieldModule,MatSelectModule,MatDatepickerModule,MatInputModule,FormsModule,CommonModule,MatIconModule],
  providers: [PeriodService],
  templateUrl: './period.component.html',
  styleUrl: './period.component.css'
})
export class PeriodComponent {

  sinceDate: Date;
  toDate: Date;

  constructor(public periodService: PeriodService,private datePipe: DatePipe) { }

  onPeriod: any[];  


  async ngOnInit() {
    await this.periodService.loadPeriod(); // Espera a que los datos se carguen
    this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod
  }
  

  checkDisable(){
   //Makes Buttons go Disabled
    return this.onPeriod['exist_period'];
  }  


AddPeriod(){
  const fechaFormateada1 = this.datePipe.transform(this.sinceDate, 'yyyy-MM-dd');
  const fechaFormateada2 = this.datePipe.transform(this.toDate, 'yyyy-MM-dd');
  const ano1 = this.datePipe.transform(this.sinceDate, 'yyyy');
  const ano2 = this.datePipe.transform(this.toDate, 'yyyy');
  const name = ano1+'-'+ano2;

  if(name != this.onPeriod['time_period']){
    Swal.fire({
      title: '¡No has seleccionado un intervalo de  fechas validas!',
      text: 'Escoge una fecha existente que se encuentre en el periodo escolar proximo',
      icon: 'warning'
    });    
    return;    
  }

  if (!this.validateReggexDate(fechaFormateada1) && !this.validateReggexDate(fechaFormateada2)){
    Swal.fire({
      title: '¡No has seleccionado una fecha valida! o esta vacio',
      text: 'Escoge una fecha existente que se encuentre en el periodo escolar proximo',
      icon: 'warning'
    });    
    return;
  }
    
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });
  swalWithBootstrapButtons.fire({
    title: "¿Estas Seguro?",
    text: "Una vez creado el periodo no se podra eliminar ni modificar el periodo, ¡Revisa Bien!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, Estoy seguro",
    cancelButtonText: "¡No, cancelalo!",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.SendPeriodData(fechaFormateada1,fechaFormateada2,name);
      swalWithBootstrapButtons.fire({
        title: "¡Periodo Creado!",
        text: "El nuevo periodo escolar ha sido establecido.",
        icon: "success"
      })

    } else if (
      /* Read more about handling dismissals below */
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire({
        title: "Cancelado",
        text: "Estate seguro la proxima vez, sonso",
        icon: "error"
      });
    }
  });
}


SendPeriodData(date1:string,date2:string,current_name){

const datos = {
  SendPeriodData: "",
  sinceDate: date1,
  toDate: date2,
  name: current_name
};

  console.log('Formulario válido');
  // Aquí envia los datos al backend
  fetch('http://localhost/jfb_rest_api/server.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
  .then(response => response.json())
  .then(data => {

    console.log(data);

  })
  .catch(error => {
    console.error('Error:', error);
  });


}

validateReggexDate(date: string): boolean {
  const formatoRegex = /^(\d{4}-\d{2}-\d{2})$/;
  return formatoRegex.test(date);
}

}
