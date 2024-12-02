import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ArcElement, PieController, Tooltip, Legend, Colors } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';

Chart.register(ArcElement, PieController, Tooltip, Legend);

@Component({
  selector: 'app-student-relation',
  standalone: true,
  providers: [
    provideCharts({ registerables: [PieController, Legend, Colors] })
  ],
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './student-relation.component.html',
  styleUrls: ['./student-relation.component.css']
})
export class StudentRelationComponent implements OnInit, OnChanges {
  @Input() reportList: any = { studentRelTotal: [] };
  @Input() period: string = '';

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'pie'> | undefined;

  public pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };
  public pieChartType = 'pie' as const;

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Relación de Estudiantes', backgroundColor: [], borderColor: [], borderWidth: 1 },
    ],
  };

  ngOnInit(): void {
    this.updatePieData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['period'] || changes['reportList']) {
      this.updatePieData();
    }
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  updatePieData(): void {
    if (this.reportList && this.reportList.studentRelTotal) {
      const labels = this.reportList.studentRelTotal.map(item => item.student_rel);
      const data = this.reportList.studentRelTotal.map(item => item.total || 0);
      const backgroundColor = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56']; // Puedes añadir más colores si es necesario

      this.pieChartData.labels = labels;
      this.pieChartData.datasets[0].data = data;
      this.pieChartData.datasets[0].backgroundColor = backgroundColor.slice(0, data.length);
      this.chart?.update();

      console.log('Datos actualizados:', this.reportList);
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
