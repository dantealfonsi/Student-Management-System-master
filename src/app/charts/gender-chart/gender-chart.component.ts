import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';
import { CategoryScale, Chart, ChartConfiguration, LinearScale, ChartData, ChartEvent, Colors, Legend, ArcElement, DoughnutController } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';

Chart.register(CategoryScale, LinearScale, ArcElement, DoughnutController);

@Component({
  selector: 'gender-chart',
  standalone: true,
  providers: [
    provideCharts({ registerables: [DoughnutController, Legend, Colors] })
  ],
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    ToggleSwitchComponent,
    BaseChartDirective
  ],
  templateUrl: './gender-chart.component.html',
  styleUrls: ['./gender-chart.component.css']
})
export class GenderChartComponent implements OnInit, OnChanges {
  
  @Input() reportList: any;
  @Input() period: string;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'doughnut'> | undefined;

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    plugins: {
      legend: {
        display: true,
      },
    },
  };
  public doughnutChartType = 'doughnut' as const;

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Estudiantes', backgroundColor: ['#dcdaf7', 'rgb(99 87 255)'] },
    ],
  };

  ngOnInit(): void {
    this.updateGenderData();
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  updateGenderData(): void {
    if (this.reportList && this.reportList.studentGenders) {
      const labels = ['Femenino', 'Masculino'];
      const femeninoData = this.reportList.studentGenders.find(g => g.gender === 'femenino')?.count || 0;
      const masculinoData = this.reportList.studentGenders.find(g => g.gender === 'masculino')?.count || 0;

      this.doughnutChartData.labels = labels;
      this.doughnutChartData.datasets[0].data = [femeninoData, masculinoData];
      this.chart?.update();

      console.log('Periodo actualizado:', this.period);
    }
  }

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
