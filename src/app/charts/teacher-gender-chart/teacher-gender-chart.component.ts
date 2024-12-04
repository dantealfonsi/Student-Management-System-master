import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';
import { CategoryScale, Chart, ChartConfiguration, LinearScale, ChartData, ChartEvent, Colors, Legend, ArcElement, DoughnutController } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatIconModule } from '@angular/material/icon';

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
    BaseChartDirective,
    MatIconModule
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





  @ViewChild('pdfContent') pdfElement!: ElementRef;


  generatePDF() {
    const pdfContent = this.pdfElement.nativeElement;
    const exportButton = document.querySelector('.export');

    // Ocultar el botón
    if (exportButton) {
      exportButton.classList.add('hidden');
    }

    html2canvas(pdfContent, { scale: 2, backgroundColor: '#FFFFFF' }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'letter'
      });

      const margin = 30;
      const marginY = 180; // Ajuste de margen superior

      // Añadir la imagen del escudo y los encabezados al PDF
      const img = new Image();
      img.src = '../../assets/img/JFB_LOGO_PURPLE.png'; // Cambia esto a la ruta real de tu imagen
      
      img.onload = () => {
        doc.addImage(img, 'PNG', 80, 40, 90, 90); // Aumentar tamaño de la imagen
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40); // Color del texto del primer encabezado
        doc.text('Unidad Educativa José Francisco Bermúdez', 180, 80);

        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0); // Color del texto de "Reportes"
        doc.text('Reportes: Profesores Por Genero', 180, 100);

        // Ajustar el tamaño y posición del contenido capturado en el PDF
        const scale = 0.60; // Ajusta este valor para hacer el contenido un poco más ancho
        const pdfWidth = (doc.internal.pageSize.getWidth() + 12 * margin) * scale;
        const pdfHeight = (doc.internal.pageSize.getHeight() - 70 - margin) * scale;
        const xOffset = (doc.internal.pageSize.getWidth() - pdfWidth) / 2; // Centrar horizontalmente

        // Añadir el contenido capturado al PDF
        doc.addImage(imgData, 'PNG', xOffset, marginY, pdfWidth, pdfHeight);

        // Guardar el PDF
        doc.save('reporte_profesores_por_genero.pdf');

        // Mostrar el botón nuevamente
        if (exportButton) {
          exportButton.classList.remove('hidden');
        }
      };
    });
  }


  
}
