import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartEvent, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Colors } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatIconModule } from '@angular/material/icon';

Chart.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend);

@Component({
  selector: 'app-sections-by-turn',
  standalone: true,
  providers: [
    provideCharts({ registerables: [BarController, Legend, Colors] })
  ],
  imports: [
    CommonModule,
    BaseChartDirective,
    MatIconModule
  ],
  templateUrl: './sections-by-turn.component.html',
  styleUrls: ['./sections-by-turn.component.css']
})
export class SectionsByTurnComponent implements OnInit, OnChanges {

  //////////////////DIRECTIVES///////////////////////

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  //////////////////END DIRECTIVES///////////////////////

  //////////////////LIST VARIABLES///////////////////////

  @Input() reportList: any = { sectionByTurn: [] };
  @Input() period: string = '';

  //////////////////END LIST VARIABLES///////////////////////


  //////////////////CHART VARIABLES///////////////////////

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

  //////////////////END CHART VARIABLES///////////////////////


  ngOnInit(): void {
    this.updateBarData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['period'] || changes['reportList']) {
      this.updateBarData();
    }
  }

  //////////////////QUERY CONTROLLERS///////////////////////

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  //////////////////END QUERY CONTROLLERS///////////////////////

  //////////////////CHART CONTROLLERS///////////////////////

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
        doc.text('Reportes: Secciones Por Turno', 180, 100);

        // Ajustar el tamaño y posición del contenido capturado en el PDF
        const scale = 0.60; // Ajusta este valor para hacer el contenido un poco más ancho
        const pdfWidth = (doc.internal.pageSize.getWidth() + 12 * margin) * scale;
        const pdfHeight = (doc.internal.pageSize.getHeight() - 70 - margin) * scale;
        const xOffset = (doc.internal.pageSize.getWidth() - pdfWidth) / 2; // Centrar horizontalmente

        // Añadir el contenido capturado al PDF
        doc.addImage(imgData, 'PNG', xOffset, marginY, pdfWidth, pdfHeight);

        // Guardar el PDF
        doc.save('reporte_secciones_por_turno.pdf');

        // Mostrar el botón nuevamente
        if (exportButton) {
          exportButton.classList.remove('hidden');
        }
      };
    });
  }

  //////////////////END PDF CONTROLLERS///////////////////////

}
