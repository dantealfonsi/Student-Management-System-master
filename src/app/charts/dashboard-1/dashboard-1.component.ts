import { Component, OnInit, Input, ViewChild, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { CategoryScale, Chart, BarController, BarElement, LinearScale, Title, Tooltip, Legend, ChartConfiguration, ChartEvent, ChartData } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { MatIconModule } from '@angular/material/icon';

Chart.register(CategoryScale, BarController, BarElement, LinearScale, Title, Tooltip, Legend);

@Component({
  selector: 'dashboard-1',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButton, BaseChartDirective, MatIconModule],
  templateUrl: './dashboard-1.component.html',
  styleUrl: './dashboard-1.component.css'
})
export class Dashboard1Component {

  ////////////DIRECTIVES //////////////////////

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  ////////////END DIRECTIVES //////////////////////

  ////////////LIST VARIABLES //////////////////////

  reportList: any;

  ////////////END LIST VARIABLES //////////////////////

  //////////CHART VARIABLES////////////////////

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['red', '#42A5F5'], // Cambia este color a tu preferencia
        label: 'Estudiantes Registrados'
      },
    ],
  };
  
  //////////END CHART VARIABLES////////////////////

  async ngOnInit() {
    this.reportList = await this.reportRecover('all');
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


  ///////////////CHART CONTROLLERS//////////////////////////////

  updateChartData(studentByPeriod: any[]): void {
    const labels = studentByPeriod.map(item => item.period);
    const data = studentByPeriod.map(item => item.total_entries);
    const backgroundColor = studentByPeriod.map((_, index) => index % 2 === 0 ? 'rgb(99 87 255)' : '#D3C8F9'); // Azul y verde
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

  public randomize(): void {
    // Genera valores aleatorios para probar
    const newData = this.barChartData.datasets[0].data.map(() => Math.round(Math.random() * 100));
    this.barChartData.datasets[0].data = newData;

    this.chart?.update();
  }

  ///////////////END CHART CONTROLLERS//////////////////////////////



  /////////////PDF CONTROLLERS/////////////////////

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
        doc.text('Reportes: Estudiantes Por Periodo', 180, 100);

        // Ajustar el tamaño y posición del contenido capturado en el PDF
        const scale = 0.60; // Ajusta este valor para hacer el contenido un poco más ancho
        const pdfWidth = (doc.internal.pageSize.getWidth() + 12 * margin) * scale;
        const pdfHeight = (doc.internal.pageSize.getHeight() - 70 - margin) * scale;
        const xOffset = (doc.internal.pageSize.getWidth() - pdfWidth) / 2; // Centrar horizontalmente

        // Añadir el contenido capturado al PDF
        doc.addImage(imgData, 'PNG', xOffset, marginY, pdfWidth, pdfHeight);

        // Guardar el PDF
        doc.save('reporte_estudiantes_por_periodo.pdf');

        // Mostrar el botón nuevamente
        if (exportButton) {
          exportButton.classList.remove('hidden');
        }
      };
    });
  }
  /////////////END PDF CONTROLLERS/////////////////////


  ////////////QUERY CONTROLLERS //////////////////////


  async reportRecover(period: string): Promise<[]> {
    try {
      const response = await fetch("http://localhost/jfb_rest_api/server.php?reportStatistics=&period=" + period);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      //console.log("Datos recibidos:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return [];
    }
  }

  getKeys(obj: any) {
    return Object.keys(obj);
  }


  ////////////END QUERY CONTROLLERS //////////////////////


}
