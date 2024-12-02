import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';
import { Chart, ChartConfiguration, ChartData, ChartEvent, Colors, Legend, RadialLinearScale, ArcElement, PolarAreaController } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';

Chart.register(RadialLinearScale, ArcElement, PolarAreaController);

@Component({
  selector: 'app-students-by-turn',
  standalone: true,
  providers: [
    provideCharts({ registerables: [PolarAreaController, Legend, Colors] })
  ],
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    ToggleSwitchComponent,
    BaseChartDirective
  ],
  templateUrl: './students-by-turn.component.html',
  styleUrls: ['./students-by-turn.component.css']
})
export class StudentsByTurnComponent implements OnInit, OnChanges {
  @Input() reportList: any;
  @Input() period: string;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'polarArea'> | undefined;

  public polarAreaChartOptions: ChartConfiguration<'polarArea'>['options'] = {
    responsive: true,
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 10
      }
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };
  public polarAreaChartType = 'polarArea' as const;

  public polarAreaChartData: ChartData<'polarArea'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Estudiantes', backgroundColor: ['#ff9c0152', 'rgb(99 87 255)']},
    ],
  };

  ngOnInit(): void {
    this.updatePolarAreaData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['period']) {
      this.updatePolarAreaData();
      setTimeout(() => {
        this.updatePolarAreaData();
      }, 100);
    }
  }

  getKeys(obj: any) {
    return Object.keys(obj);
  }

  updatePolarAreaData(): void {
    if (this.reportList && this.reportList.studentByTurn) {
      const labels = this.reportList.studentByTurn.map(item => item.turno);
      const data = this.reportList.studentByTurn.map(item => item.total_estudiantes || 0);

      this.polarAreaChartData.labels = labels;
      this.polarAreaChartData.datasets[0].data = data;
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
