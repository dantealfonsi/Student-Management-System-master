import { Component, ViewChild,OnInit, Input, SimpleChanges} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

interface Teacher {
  fullName: string;  
  cedula: string;
  sections: any;
}


@Component({
  selector: 'app-section-teacher',
  standalone: true,
  imports: [MatPaginatorModule,MatTableModule,MatSortModule,MatIconModule,CommonModule],
  templateUrl: './section-teacher.component.html',
  styleUrl: './section-teacher.component.css'
})
export class SectionTeacherComponent {

    
  sectionTeacherData: any;
  sectionTeacherDataMat = new MatTableDataSource<any>();


  constructor(private _formBuilder: FormBuilder) {}

  @ViewChild(MatPaginator) paginator! : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() period: string = '';


  async ngOnInit() {

    this.loadData();

  }


  async sectionTeacherDataList() {

    try {
      const response = await fetch('http://localhost/jfb_rest_api/server.php?section_teacher&period='+this.period);
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
    this.sectionTeacherData = await this.sectionTeacherDataList();
    this.sectionTeacherDataMat.data = this.sectionTeacherData;
    this.sectionTeacherDataMat = new MatTableDataSource<Teacher>(this.sectionTeacherData);
    this.sectionTeacherDataMat.paginator = this.paginator;
    this.sectionTeacherDataMat.sort = this.sort;
  
    console.log('userData:', this.sectionTeacherData); // Verifica el contenido de userData
  
  }
  

  
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.sectionTeacherDataMat.filter = filterValue.trim().toLowerCase();
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
    doc.text('Reportes: Profesores Guía', 50, 30);

    // Función para capitalizar la primera letra de cada palabra
    function capitalizeWords(str) {
      return str.replace(/\b\w+/g, function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      });
    }

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
          data.cell.text = data.cell.text.map(t => capitalizeWords(t)); // Capitalizar texto de las celdas
        }
      },
      didDrawCell: (data) => {
        console.log(data.cell.raw); // Para depurar y verificar qué celdas se están dibujando
      }
    });

    // Guardar el documento con nombre específico
    doc.save('reporte_profesor_guia.pdf');
  }
}





  firstLetterUpperCase(word: string): string {
  return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
  } 
  
  capitalizeWords(str : string) : string {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
 }


 ngOnChanges(changes: SimpleChanges) { 
  if (changes['period']) {
    this.loadData();
    setTimeout(() => {
      this.loadData();
    }, 10);
  }
}
      
 

 
}
