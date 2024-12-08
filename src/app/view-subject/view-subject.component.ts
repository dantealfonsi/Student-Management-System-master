import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, viewChild, ElementRef, Renderer2 } from "@angular/core";
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
    private el: ElementRef, private renderer: Renderer2
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

    const img = new Image();
    img.src = '../../assets/img/JFB_LOGO_PURPLE.png';

    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 10, 30, 30);

      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Unidad Educativa José Francisco Bermúdez', 50, 20);

      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('Reportes: Materias', 50, 30);

      // Ocultar la última columna
      const table = this.el.nativeElement.querySelector('#content');
      const rows = table.querySelectorAll('tr');

      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 0) {
          this.renderer.setStyle(cells[cells.length - 1], 'display', 'none');
        }
      });

      autoTable(doc, {
        html: '#content',
        startY: 50,
        styles: {
          fontSize: 12,
          cellPadding: 3,
          textColor: [0, 0, 0],
          fillColor: [220, 220, 220],
        },
        headStyles: {
          fillColor: '#846CEF',
          textColor: '#FFFFFF'
        },
        didParseCell: (data) => {
          if (data.section === 'body') {
            data.cell.text = data.cell.text.map(t => t.charAt(0).toUpperCase() + t.slice(1));
          }
        },
        didDrawCell: (data) => {
          console.log(data.cell.raw);
        }
      });

      // Mostrar la última columna de nuevo
      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 0) {
          this.renderer.setStyle(cells[cells.length - 1], 'display', '');
        }
      });

      doc.save('reporte_materias.pdf');
    };
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
