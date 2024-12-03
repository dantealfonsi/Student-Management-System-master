import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ArcElement, DoughnutController, Tooltip, Legend, Colors } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

@Component({
  selector: 'app-teacher-by-degree',
  standalone: true,
  providers: [
    provideCharts({ registerables: [DoughnutController, Legend, Colors] })
  ],
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './teacher-by-degree.component.html',
  styleUrls: ['./teacher-by-degree.component.css']
})
export class TeacherByDegreeComponent implements OnInit, OnChanges {
  @Input() reportList: any = { teacherByDegree: [] };
  @Input() period: string = '';

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'doughnut'> | undefined;

  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          // Usar una función callback para modificar el texto de la leyenda
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, index) => {
              const labelText = String(label)
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' '); // Capitalize cada palabra
              return {
                text: labelText,
                fillStyle: data.datasets[0].backgroundColor[index],
                index: index,
                lineWidth: 0, // Establecer el ancho del borde a 0

              };
            });
          }
        }
      },
    },
  };
  public doughnutChartType = 'doughnut' as const;

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Docentes', backgroundColor: []},
    ],
  };

  ngOnInit(): void {
    this.updateDoughnutData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['period'] || changes['reportList']) {
      this.updateDoughnutData();
    }
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  updateDoughnutData(): void {
    if (this.reportList && this.reportList.teacherByDegree) {
      const labels = this.reportList.teacherByDegree.map(item => item.combined_degree.trim());
      const data = this.reportList.teacherByDegree.map(item => item.number_of_teachers || 0);
      const backgroundColor = ['#D2C8F9', '#E1DAFB', '#D3C8F9', 'rgb(99 87 255)','#A691F3','#7A5AED','#4D23E7']; // Puedes añadir más colores si es necesario

      this.doughnutChartData.labels = labels;
      this.doughnutChartData.datasets[0].data = data;
      this.doughnutChartData.datasets[0].backgroundColor = backgroundColor.slice(0, data.length);
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
