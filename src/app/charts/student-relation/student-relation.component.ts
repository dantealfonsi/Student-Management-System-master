import { Component, Input, SimpleChanges, ViewChild, OnInit, OnChanges, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ArcElement, PieController, Tooltip, Legend, Colors } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

Chart.register(ArcElement, PieController, Tooltip, Legend);

@Component({
  selector: 'app-student-relation',
  standalone: true,
  providers: [
    provideCharts({ registerables: [PieController, Legend, Colors] })
  ],
  imports: [
    CommonModule,
    BaseChartDirective,
    MatIconModule
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
      }
    }
  };
  public pieChartType = 'pie' as const;
  

  public pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Relación de Estudiantes', backgroundColor: []},
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
      const backgroundColor = ['#D2C8F9', '#E1DAFB', '#D3C8F9', 'rgb(99 87 255)','#A691F3','#7A5AED','#4D23E7']; // Puedes añadir más colores si es necesario

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
        doc.text('Reportes: Relaciones De Estudiantes', 180, 100);

        // Ajustar el tamaño y posición del contenido capturado en el PDF
        const scale = 0.60; // Ajusta este valor para hacer el contenido un poco más ancho
        const pdfWidth = (doc.internal.pageSize.getWidth() + 12 * margin) * scale;
        const pdfHeight = (doc.internal.pageSize.getHeight() - 70 - margin) * scale;
        const xOffset = (doc.internal.pageSize.getWidth() - pdfWidth) / 2; // Centrar horizontalmente

        // Añadir el contenido capturado al PDF
        doc.addImage(imgData, 'PNG', xOffset, marginY, pdfWidth, pdfHeight);

        // Guardar el PDF
        doc.save('reporte_relaciones_de_estudiantes.pdf');

        // Mostrar el botón nuevamente
        if (exportButton) {
          exportButton.classList.remove('hidden');
        }
      };
    });
  }


  
}
