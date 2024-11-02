import { Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';
import { BarController, CategoryScale, Chart, ChartConfiguration,LinearScale, ChartData, ChartEvent, Colors, Legend, BarElement } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {provideCharts,} from 'ng2-charts';

@Component({
  selector: 'students-by-period-chart',
  standalone: true,
  providers: [
    provideCharts({ registerables: [BarController, Legend, Colors] })
  ],
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    ToggleSwitchComponent,
    BaseChartDirective
    
  ],
  templateUrl: './students-by-period-chart.component.html',
  styleUrl: './students-by-period-chart.component.css'
})
export class StudentsByPeriodChartComponent {
  @Input() reportList: any;
  @Input() period: string;




ngOnInit(): void {
  this.updateData();
}

ngOnChanges(changes: SimpleChanges) {
  //console.log('Changes detected:', changes);
  if (changes['period']) {
    this.updateData();
    setTimeout(() => {
      this.updateData();
    }, 100);
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
      min: 0,
    },
  },
  plugins: {
    legend: {
      display: true,
    },
  },
};
public barChartType = 'bar' as const;

// Inicializa los datos del gráfico
public barChartData: ChartData<'bar'> = {
  labels: [],
  datasets: [
    { data: [], label: 'Total Entries' },
  ],
};

// Datos de ejemplo


// Actualiza los datos del gráfico
updateData() {
  const labels = [];
  const data = [];

  // Asegúrate de que reportList y studentsByPeriod estén definidos
  this.reportList = this.reportList || {};
  this.reportList.studentsByPeriod = this.reportList.studentsByPeriod || [];

  // Llenar los datos para los gráficos
  if (Array.isArray(this.reportList.studentsByPeriod)) {
    this.reportList.studentsByPeriod.forEach(entry => {
      labels.push(entry.period);
      data.push(entry.total_entries);
    });
  } else {
    console.error('studentsByPeriod no es un array');
  }

  this.barChartData.labels = labels;
  this.barChartData.datasets[0].data = data;
  this.chart?.update();

  console.log('Datos actualizados:', this.barChartData);
}


updateGenderData() {
    
  const labels = [this.reportList.period];
  const femeninoData = this.reportList.teacherGenders.find(g => g.gender === 'femenino')?.total_teachers || 0;
  const masculinoData = this.reportList.teacherGenders.find(g => g.gender === 'masculino')?.total_teachers || 0;

  this.barChartData.labels = labels;
  this.barChartData.datasets[0].data = [femeninoData];
  this.barChartData.datasets[1].data = [masculinoData];
  this.chart?.update();

  console.log('Periodo actualizado:', this.period);

}

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

public chartHovered({
  event,
  active,
}: {
  event?: ChartEvent;
  active?: object[];
}): void {
  console.log(event, active);
}
}
