import { ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';
import { PeriodService } from '../period.service';
import { BarController, Colors, Legend } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {provideCharts,} from 'ng2-charts';
import { genderChartComponent } from '../charts/gender-chart/gender-chart.component';
import { TeacherGenderChartComponent } from '../charts/teacher-gender-chart/teacher-gender-chart.component';
import { StudentsByPeriodChartComponent } from '../charts/students-by-period-chart/students-by-period-chart.component';
import { UserHistoryComponent } from '../charts/user-history/user-history.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  providers: [
    provideCharts({ registerables: [BarController, Legend, Colors] })
  ],
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSelect,
    MatSlideToggleModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ToggleSwitchComponent,
    BaseChartDirective,
    genderChartComponent,
    TeacherGenderChartComponent,
    StudentsByPeriodChartComponent,
    UserHistoryComponent
],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})


export class ReportsComponent {
  
@ViewChild('period') period: MatSelect;

reportList: any = {
  period: "",
  studentGenders: []
};  

  reportName: string;

  onPeriod: any[];
  periodList: any;
  data: any;
  selectedPeriod: string;

  constructor(public periodService: PeriodService,private cdr: ChangeDetectorRef) {}



ngOnInit(): void {
  this.loadList();
}



async loadList() {
  try {
    await this.periodService.loadPeriod(); // Espera a que los datos se carguen
    this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod  
    this.periodList = await this.periodRecover();
    this.reportList = await this.reportRecover('all');  
    
  } catch (error) {
    console.error('Error al recuperar los datos de la lista:', error);
    // Maneja el error según tus necesidades
  }

  //this.dataSource = new MatTableDataSource(this.sectionList);
  //this.dataSource.paginator = this.paginator;
}


generatePDF() {
throw new Error('Method not implemented.');
}



async reportRecover(period:string): Promise<[]> {
  try {
    const response = await fetch("http://localhost/jfb_rest_api/server.php?reportStatistics=&period="+period);
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();
    console.log("Datos recibidos:", data);
    return data; // Devuelve los datos
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return [];
  }
}


async periodRecover(): Promise<[]> {
  try {
    const response = await fetch("http://localhost/jfb_rest_api/server.php?period_list=");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();
    console.log("Datos recibidos:", data);
    return data; // Devuelve los datos
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return [];
  }
}

async changePeriod(event) {
   this.selectedPeriod = event; // Obtener el valor del MatSelect
   
  if (this.selectedPeriod) { // Verificar que selectedDay no sea undefined
    this.reportList = await this.reportRecover(this.selectedPeriod);  
  } else {
    console.error('El valor de day es undefined');
  }
}




change(value){

  switch (value) {
    case 1: 
      this.data = 1;
      this.reportName = 'genderReport'
      break;
      case 2: 
      this.data = 2;
      this.reportName = 'teacherGenderReport'
      break;
      case 3: 
      this.data = 3;
      this.reportName = 'studentByPeriod'
      break;
      case 4: 
      this.data = 4;
      this.reportName = 'userHistory'
      break;
  
    default:
      this.reportName = 'otherReport'
      break;
  }

}

getKeys(obj: any) {
  return Object.keys(obj);
}


}
