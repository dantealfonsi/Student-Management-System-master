import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';
import { Chart, ChartConfiguration, ChartData, ChartEvent, Colors, Legend, RadialLinearScale, ArcElement, PolarAreaController } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    BaseChartDirective,
    MatIconModule
  ],
  templateUrl: './students-by-turn.component.html',
  styleUrls: ['./students-by-turn.component.css']
})
export class StudentsByTurnComponent implements OnInit, OnChanges {

  //////////////////DIRECTIVES///////////////////////

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'polarArea'> | undefined;

  //////////////////END DIRECTIVES///////////////////////

  //////////////////LIST VARIABLES///////////////////////

  @Input() reportList: any;
  @Input() period: string;

  //////////////////END LIST VARIABLES///////////////////////

  //////////////////CHART VARIABLES///////////////////////

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
      { data: [], label: 'Estudiantes', backgroundColor: ['#ff9c0152', 'rgb(99 87 255)'] },
    ],
  };

  //////////////////END CHART VARIABLES///////////////////////


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

  //////////////////QUERY CONTROLLERS///////////////////////

  getKeys(obj: any) {
    return Object.keys(obj);
  }

  //////////////////END QUERY CONTROLLERS///////////////////////

  //////////////////CHART CONTROLLERS///////////////////////

  updatePolarAreaData(): void {
    if (this.reportList && this.reportList.studentByTurn) {
      const labels = this.reportList.studentByTurn.map(item => item.turno);
      const data = this.reportList.studentByTurn.map(item => item.total_estudiantes || 0);

      this.polarAreaChartData.labels = labels;
      this.polarAreaChartData.datasets[0].data = data;
      this.chart?.update();

      //console.log('Periodo actualizado:', this.period);
    }
  }

  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    //console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    //console.log(event, active);
  }

  //////////////////END CHART CONTROLLERS///////////////////////

  //////////////////PDF CONTROLLERS///////////////////////

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
        doc.text('Reportes: Estudiantes Por Turnos', 180, 100);

        // Ajustar el tamaño y posición del contenido capturado en el PDF
        const scale = 0.60; // Ajusta este valor para hacer el contenido un poco más ancho
        const pdfWidth = (doc.internal.pageSize.getWidth() + 12 * margin) * scale;
        const pdfHeight = (doc.internal.pageSize.getHeight() - 70 - margin) * scale;
        const xOffset = (doc.internal.pageSize.getWidth() - pdfWidth) / 2; // Centrar horizontalmente

        // Añadir el contenido capturado al PDF
        doc.addImage(imgData, 'PNG', xOffset, marginY, pdfWidth, pdfHeight);

        // Guardar el PDF
        doc.save('reporte_estudiantes_por_turno.pdf');

        // Mostrar el botón nuevamente
        if (exportButton) {
          exportButton.classList.remove('hidden');
        }
      };
    });
  }

  //////////////////END PDF CONTROLLERS///////////////////////

}
