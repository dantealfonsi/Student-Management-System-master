import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartEvent, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Colors } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';

Chart.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend);

@Component({
  selector: 'app-sections-by-turn',
  standalone: true,
  providers: [
    provideCharts({ registerables: [BarController, Legend, Colors] })
  ],
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './sections-by-turn.component.html',
  styleUrls: ['./sections-by-turn.component.css']
})
export class SectionsByTurnComponent implements OnInit, OnChanges {
  @Input() reportList: any = { sectionByTurn: [] };
  @Input() period: string = '';

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
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

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Mañana', backgroundColor: '#C2B6F7' },
      { data: [], label: 'Tarde', backgroundColor: '#755AED' },
    ],
  };

  ngOnInit(): void {
    this.updateBarData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['period'] || changes['reportList']) {
      this.updateBarData();
    }
  }

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  updateBarData(): void {
    if (this.reportList && this.reportList.sectionByTurn) {
      const periods = [...new Set(this.reportList.sectionByTurn.map(item => item.period))];
      const mañanaData = periods.map(period => {
        const item = this.reportList.sectionByTurn.find(i => i.period === period && i.turno === 'Mañana');
        return item ? item.total_secciones : 0;
      });
      const tardeData = periods.map(period => {
        const item = this.reportList.sectionByTurn.find(i => i.period === period && i.turno === 'Tarde');
        return item ? item.total_secciones : 0;
      });

      this.barChartData.labels = periods;
      this.barChartData.datasets[0].data = mañanaData;
      this.barChartData.datasets[1].data = tardeData;
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
