import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CategoryScale, Chart, BarController, BarElement, LinearScale, Title, Tooltip, Legend, ChartConfiguration, ChartEvent, ChartData } from 'chart.js'; 

Chart.register(CategoryScale, BarController, BarElement, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'students-by-period-chart',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButton, BaseChartDirective],
  templateUrl: './students-by-period-chart.component.html',
  styleUrls: ['./students-by-period-chart.component.css']
})
export class StudentsByPeriodChartComponent implements OnInit, OnChanges {
  @Input() period: string;
  @Input() reportList: any;

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

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], 
        backgroundColor: ['red','#42A5F5'], // Cambia este color a tu preferencia
        label: 'Estudiantes Registrados' },
    ],
  };

  ngOnInit(): void {
    this.updateData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['period']) {
      this.updateData();
      setTimeout(() => {
        this.updateData();
      }, 100);
    }
  }

  updateData(): void {
    if (this.reportList && this.reportList.studentByPeriod) {
      this.updateChartData(this.reportList.studentByPeriod);
    }
  }

  updateChartData(studentByPeriod: any[]): void {
    const labels = studentByPeriod.map(item => item.period);
    const data = studentByPeriod.map(item => item.total_entries);
    const backgroundColor = studentByPeriod.map((_, index) => index % 2 === 0 ? '#f47e368c' : '#66ed3c40'); // Azul y verde
    this.barChartData = {
      labels,
      datasets: [
        { data, label: 'Estudiantes Registrados', backgroundColor },
      ],
    };
    this.chart?.update();
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

  public randomize(): void {
    // Genera valores aleatorios para probar
    const newData = this.barChartData.datasets[0].data.map(() => Math.round(Math.random() * 100));
    this.barChartData.datasets[0].data = newData;

    this.chart?.update();
  }

  

  getKeys(obj: any) {
    return Object.keys(obj);
  }



}
