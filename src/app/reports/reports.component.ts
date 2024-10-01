import { Component, ViewChild, OnInit, ElementRef} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';
import jsPDF from 'jspdf';
import { PeriodService } from '../period.service';
import { BarController, CategoryScale, Chart, ChartConfiguration,LinearScale, ChartData, ChartEvent, Colors, Legend, BarElement } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {provideCharts,withDefaultRegisterables,} from 'ng2-charts';

Chart.register(CategoryScale, LinearScale, BarElement);


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
    BaseChartDirective
    
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})


export class ReportsComponent {
  

  reportList: any;
  reportName: string;

  onPeriod: any[];
  periodList: any;
  data: any;


  constructor(public periodService: PeriodService) {}



ngOnInit(): void {
  this.loadList();
}



async loadList() {
  try {
    await this.periodService.loadPeriod(); // Espera a que los datos se carguen
    this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod  
    this.periodList = this.periodService['']
    this.reportList = await this.reportRecover();  
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



async reportRecover(): Promise<[]> {
  try {
    const response = await fetch("http://localhost/jfb_rest_api/server.php?reportStatistics=&period="+"2023-2024");
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


change(value){

  switch (value) {
    case 1: 
      this.data = 1;
      this.reportName = 'genderReport'
      alert(this.data);
      break;
      case 3: 
      this.data = 3;
      this.reportName = 'OtherReport'
      alert(this.data);
      break;
  
    default:
      alert(this.data = 2);
      this.reportName = 'otherReport'
      break;
  }

}

getKeys(obj: any) {
  return Object.keys(obj);
}




/////////////////GRAFICOS/////////////////////

@ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

public barChartOptions: ChartConfiguration<'bar'>['options'] = {
  scales: {
    x: {},
    y: {
      min: 10,
    },
  },
  plugins: {
    legend: {
      display: true,
    },
  },
};
public barChartType = 'bar' as const;

public barChartData: ChartData<'bar'> = {
  labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
  datasets: [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  ],
};

// events
public chartClicked({
  event,
  active,
}: {
  event?: ChartEvent;
  active?: object[];
}): void {
  console.log(event, active);
}

public randomize(): void {
  // Only Change 3 values
  this.barChartData.datasets[0].data = [
    Math.round(Math.random() * 100),
    59,
    80,
    Math.round(Math.random() * 100),
    56,
    Math.round(Math.random() * 100),
    40,
  ];

  this.chart?.update();
}


}
