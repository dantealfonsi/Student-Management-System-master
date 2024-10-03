import { Component, Input, SimpleChanges, ViewChild} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';
import { BarController, CategoryScale, Chart, ChartConfiguration,LinearScale, ChartData, ChartEvent, Colors, Legend, BarElement } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import {provideCharts,} from 'ng2-charts';

Chart.register(CategoryScale, LinearScale, BarElement);


@Component({
  selector: 'gender-chart',
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
  templateUrl: './gender-chart.component.html',
  styleUrl: './gender-chart.component.css'
})


export class genderChartComponent {
  
  @Input() reportList: any;
  @Input() period: string;




ngOnInit(): void {
  this.updateGenderData();
}

ngOnChanges(changes: SimpleChanges) {
  //console.log('Changes detected:', changes);
  if (changes['period']) {
    this.updateGenderData();
    setTimeout(() => {
      this.updateGenderData();
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
    { data: [], label: 'Femenino' },
    { data: [], label: 'Masculino' },
  ],
};

// Datos de ejemplo


// Actualiza los datos del gráfico
updateGenderData() {
    
  const labels = [this.reportList.period];
  const femeninoData = this.reportList.studentGenders.find(g => g.gender === 'femenino')?.count || 0;
  const masculinoData = this.reportList.studentGenders.find(g => g.gender === 'masculino')?.count || 0;

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
