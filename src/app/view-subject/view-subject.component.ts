import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, viewChild, ElementRef } from "@angular/core";
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { Config } from "datatables.net-dt";
import "datatables.net-buttons-dt";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatListModule } from "@angular/material/list";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { PeriodService } from "../period.service";
import Swal from "sweetalert2";
import { Subject } from "rxjs";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import jsPDF from 'jspdf' 
import autoTable from 'jspdf-autotable'
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import {MatRadioModule} from '@angular/material/radio';
import { CookieService } from "ngx-cookie-service";



interface subject{
  id: string;
  name: string;
}


@Component({
  selector: 'view-subject',
  templateUrl: './view-subject.component.html',
  styleUrls: ['./view-subject.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatListModule,
    DataTablesModule,
    CommonModule,
    MatTableModule, 
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatButtonModule,
    MatRadioModule
  ],
})

export class ViewSubjectComponent {



  // ...
  addSubjectFormGroup: FormGroup;
  showdialog: boolean = false;
  showeditdialog: boolean = false;
  subjectList: any;
  subjectListMat: any;
  subject: string;

  history: any;



  constructor(
    private _formBuilder: FormBuilder, 
    private cookieService: CookieService,
  ) {}

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {    
    this.initializeFormGroups();
    this.loadList();  
    this.history = this.getPersonIdAndUserIdFromCookie();   
 
  }

  


  async loadList() {
    try {
      this.subjectList = await this.subjectListRecover();    
      this.subjectListMat = new MatTableDataSource<subject>(this.subjectList);
      this.subjectListMat.paginator = this.paginator;  
      this.subjectListMat.sort = this.sort;

    } catch (error) {
      console.error('Error al recuperar los datos de la lista:', error);
      // Maneja el error según tus necesidades
    }

    //this.dataSource = new MatTableDataSource(this.sectionList);
    //this.dataSource.paginator = this.paginator;
  }

  async subjectListRecover() {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?subject_list="  
      );
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


  initializeFormGroups() {
    this.addSubjectFormGroup = this._formBuilder.group({
      id: ['0'],
      name: ["", Validators.required],
      grupo_estable: ['0']
    });
  }


  onEditList(id: string) {
    this.openEditDialog();
    const selectedId = id;
    const selectedSubject = this.subjectList.find(p => p.id === selectedId);
    if (selectedSubject) {
      this.addSubjectFormGroup.patchValue({
        id: selectedSubject.id,
        name: selectedSubject.name,
        grupo_estable: selectedSubject.grupo_estable,
      });
    }
    console.log("edit:",selectedSubject);
  }  

/////////////////////////////AGREGAR Y EDITAR ////////////////////




addSubject() {

  const datos = {
    addSubject: '',
    subject: this.addSubjectFormGroup.value,
    history: this.history

  };

    if (this.addSubjectFormGroup.valid){

      fetch('http://localhost/jfb_rest_api/server.php',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      }).then(response => response.json())
        .then(data => {
          console.log(data);
          if(data['icon']==='success'){
            Swal.fire({
              title: 'Nuevo Mensaje:',
              text: data['message'],
              icon: data['icon']
            });
            this.loadList();
            this.addSubjectFormGroup.patchValue({
              name: ""
            })
            this.hideDialog();
          } else{
            Swal.fire({
              title: 'Nuevo Mensaje:',
              text: data['message'],
              icon: data['icon']
            });
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
  
      } else {
        // El formulario no tiene valores válidos
        Swal.fire({
          title: '¡Faltan Datos en este formulario!',
          text: 'No puedes agregar debido a que no has ingesado todos los datos.',
          icon: 'error'
        });    
      }    
  }


  editSubject() {
    const datos = {
      editSubject: '',
      subject: this.addSubjectFormGroup.value,
      history: this.history

    };
  
      if (this.addSubjectFormGroup.valid){
  
        fetch('http://localhost/jfb_rest_api/server.php',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        }).then(response => response.json())
          .then(data => {
              Swal.fire({
                title: 'Nuevo Mensaje:',
                text: data['message'],
                icon: data['icon']
              });
              this.loadList();
              this.hideEditDialog();
          })
          .catch(error => {
            console.error('Error:', error);
          });
    
        } else {
          // El formulario no tiene valores válidos
          Swal.fire({
            title: '¡Faltan Datos en este formulario!',
            text: 'No puedes agregar debido a que no has ingesado todos los datos.',
            icon: 'error'
          });    
        }    
    }

      
  onDropList(id: any) {
    const datos = {
      updateSingleFieldSubject: id,
      tabla: "subject",
      campo: "isDeleted",
      whereCondition: `id = ${id}`,
      valor: 1,
      history: this.history

    };

    Swal.fire({
      title: "¿Estás seguro de deshabilitarlo?",
      text: "¡Esta asignatura no seguirá apareciendo en la lista!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Deshabilítala"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Completado!",
          text: "La lista ha sido deshabilitada.",
          icon: "success"
        });
        fetch('http://localhost/jfb_rest_api/server.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          this.loadList();
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  }


////////////////////////////LISTAS////////////////////////////////

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.subjectListMat.filter = filterValue.trim().toLowerCase();
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
      doc.text('Reportes: Materias De La Institución', 50, 30);
  
      // Seleccionar las columnas "Acciones" y "Rango"
      const table = document.getElementById("content");
      const rows = table.querySelectorAll("tr");
  
      rows.forEach(row => {
        const cells = row.querySelectorAll("th, td");
        cells[cells.length - 1].remove(); // Eliminar última columna (Acciones)
      });
  
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
            data.cell.text = data.cell.text.map(t => t.charAt(0).toUpperCase() + t.slice(1)); // Capitalizar texto de las celdas
          }
        },
        didDrawCell: (data) => {
          console.log(data.cell.raw); // Para depurar y verificar qué celdas se están dibujando
        }
      });
  
      // Guardar el documento con nombre específico
      doc.save('reporte_materias.pdf');
    }
  }
 
  openDialog() {
    this.showdialog = true;
  }

  openEditDialog() {
    this.showeditdialog = true;
  }


  hideDialog() {
    this.showdialog = false;
  }

  hideEditDialog() {
    this.showeditdialog = false;
  }

  firstLetterUpperCase(word: string): string {
    return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
} 

capitalizeWords(str : string) : string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}




////////////////////////////////////USER HISTORY ///////////////////////////////////

getPersonIdAndUserIdFromCookie() { 
  const person_id = this.cookieService.get('person_id'); 
  const user = this.cookieService.get('user_id'); 
  
  return { person_id, user }; 
}


}
