import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';
import { CategoryScale, Chart, ChartConfiguration, LinearScale, ChartData, ChartEvent, Colors, Legend, ArcElement, DoughnutController } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';

Chart.register(CategoryScale, LinearScale, ArcElement, DoughnutController);

@Component({
  selector: 'teacher-gender-chart',
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
  templateUrl: './teacher-gender-chart.component.html',
  styleUrls: ['./teacher-gender-chart.component.css']
})
export class TeacherGenderChartComponent implements OnInit, OnChanges {
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
      { data: [], label: 'Docentes', backgroundColor: ['#ff9c0152', '#dcdaf7'] },
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
    if (this.reportList && this.reportList.teacherGenders) {
      const labels = ['Femenino', 'Masculino'];
      const femeninoData = this.reportList.teacherGenders.find(g => g.gender === 'femenino')?.total_teachers || 0;
      const masculinoData = this.reportList.teacherGenders.find(g => g.gender === 'masculino')?.total_teachers || 0;

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
