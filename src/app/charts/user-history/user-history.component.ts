import { Component, ViewChild,OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatIconModule } from "@angular/material/icon";


interface History {
  action: string;  
  date: string;
}

@Component({
  selector: 'app-user-history',
  standalone: true,
  imports: [MatPaginatorModule,MatTableModule,MatSortModule,MatIconModule],
  templateUrl: './user-history.component.html',
  styleUrl: './user-history.component.css'
})
export class UserHistoryComponent {

  
  historyData: any;
  historyDataMat = new MatTableDataSource<any>();


  constructor(private _formBuilder: FormBuilder) {}

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  async ngOnInit() {
    this.historyData = await this.historyDataList();
    this.historyDataMat.data = this.historyData;
    this.historyDataMat.paginator = this.paginator;
    this.historyDataMat.sort = this.sort;
  }

  async historyDataList() {
    try {
      const response = await fetch('http://localhost/jfb_rest_api/server.php?history_data');
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      console.log("Datos recibidos:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  
  async loadData() {
    // Paso 1: Obtener el valor del local storage
  
    // Asegúrate de que this_user_recover se complete antes de seguir
    this.historyData = await this.historyDataList();
    this.historyDataMat = new MatTableDataSource<History>(this.historyData);
  
    console.log('userData:', this.historyData); // Verifica el contenido de userData
    console.log('MarkData:', this.historyDataList); // Verifica el contenido de marklist
  
  }
  

  
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.historyDataMat.filter = filterValue.trim().toLowerCase();
}

downloadPdf() {
  const doc = new jsPDF();

  // Cargar imagen del escudo
  const img = new Image();
  img.src = '../../assets/img/JFB_LOGO_PURPLE.png'; // Cambia esto a la ruta real de tu imagen
  
  img.onload = () => {
    doc.addImage(img, 'PNG', 14, 10, 30, 30); // Añade la imagen al PDF

    // Añadir primer encabezado
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40); // Color del texto del primer encabezado
    doc.text('Unidad Educativa José Francisco Bermúdez', 50, 20);

    // Añadir segundo encabezado justo debajo
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0); // Color del texto de "Reportes"
    doc.text('Reportes: Historial de Usuario', 50, 30);

    // Usar autoTable para generar la tabla basada en el contenido HTML
    autoTable(doc, {
      html: '#content',
      startY: 50,
      styles: {
        fontSize: 12,
        cellPadding: 3,
        textColor: [0, 0, 0], // Color del texto de las celdas
        fillColor: [220, 220, 220], // Color de fondo de las celdas
      },
      headStyles: {
        fillColor: '#846CEF', // Color de fondo del thead
        textColor: '#FFFFFF' // Color del texto del thead
      },
      didParseCell: function(data) {
        if (data.section === 'body') {
          data.cell.text = data.cell.text.map(t => t.charAt(0).toUpperCase() + t.slice(1)); // Capitalize texto de las celdas
        }
      },
      didDrawCell: (data) => {
        console.log(data.cell.raw); // Para depurar y verificar qué celdas se están dibujando
      }
    });

    // Guardar el documento con nombre específico
    doc.save('reporte_historial.pdf');
  }
}


  firstLetterUpperCase(word: string): string {
  return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
  } 
  
  capitalizeWords(str : string) : string {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
 }
      
      
 
  
}

