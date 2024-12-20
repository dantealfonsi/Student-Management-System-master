import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ArcElement, DoughnutController, Tooltip, Legend, Colors } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatIconModule } from '@angular/material/icon';

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

@Component({
  selector: 'app-teacher-by-degree',
  standalone: true,
  providers: [
    provideCharts({ registerables: [DoughnutController, Legend, Colors] })
  ],
  imports: [
    CommonModule,
    BaseChartDirective,
    MatIconModule
  ],
  templateUrl: './teacher-by-degree.component.html',
  styleUrls: ['./teacher-by-degree.component.css']
})
export class TeacherByDegreeComponent implements OnInit, OnChanges {

  //////////////////DIRECTIVES///////////////////////

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'doughnut'> | undefined;

  //////////////////END DIRECTIVES///////////////////////

  //////////////////LIST VARIABLES///////////////////////

  @Input() reportList: any = { teacherByDegree: [] };
  @Input() period: string = '';

  //////////////////END LIST VARIABLES///////////////////////

  //////////////////CHART VARIABLES///////////////////////

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
      { data: [], label: 'Docentes', backgroundColor: [] },
    ],
  };

  //////////////////END CHART VARIABLES///////////////////////



  ngOnInit(): void {
    this.updateDoughnutData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['period'] || changes['reportList']) {
      this.updateDoughnutData();
    }
  }

  //////////////////QUERY CONTROLLERS///////////////////////

  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  //////////////////END QUERY CONTROLLERS///////////////////////


  //////////////////CHART CONTROLLERS///////////////////////

  updateDoughnutData(): void {
    if (this.reportList && this.reportList.teacherByDegree) {
      const labels = this.reportList.teacherByDegree.map(item => item.combined_degree.trim());
      const data = this.reportList.teacherByDegree.map(item => item.number_of_teachers || 0);
      const backgroundColor = ['#D2C8F9', '#E1DAFB', '#D3C8F9', 'rgb(99 87 255)', '#A691F3', '#7A5AED', '#4D23E7']; // Puedes añadir más colores si es necesario

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
        doc.text('Reportes: Profesores Por Carrera', 180, 100);

        // Ajustar el tamaño y posición del contenido capturado en el PDF
        const scale = 0.60; // Ajusta este valor para hacer el contenido un poco más ancho
        const pdfWidth = (doc.internal.pageSize.getWidth() + 12 * margin) * scale;
        const pdfHeight = (doc.internal.pageSize.getHeight() - 70 - margin) * scale;
        const xOffset = (doc.internal.pageSize.getWidth() - pdfWidth) / 2; // Centrar horizontalmente

        // Añadir el contenido capturado al PDF
        doc.addImage(imgData, 'PNG', xOffset, marginY, pdfWidth, pdfHeight);

        // Guardar el PDF
        doc.save('reporte_profesores_por_carrera.pdf');

        // Mostrar el botón nuevamente
        if (exportButton) {
          exportButton.classList.remove('hidden');
        }
      };
    });
  }

  //////////////////END PDF CONTROLLERS///////////////////////

}
