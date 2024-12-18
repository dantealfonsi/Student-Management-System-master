import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, viewChild, ElementRef, Renderer2 } from "@angular/core";
import { Config } from "datatables.net-dt";
import "datatables.net-buttons-dt";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ValidationErrors,
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
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { CookieService } from "ngx-cookie-service";
import {ChangeDetectionStrategy, signal} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';

interface Student {
  cedula: string;
  name: string;
  last_name: string;
  phone: string;
  registration: {
    year: string;
    section_name: string;
    parent: {
      name: string;
      last_name: string;
    }

  };
}

interface RegistrationList{
  year: string;
  section_id:{
    section_name: string;
    period: string;
  }
  parent_id:{
    name: string;
    last_name: string;
  } 

}


@Component({
  selector: 'view-students',
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
    CommonModule,
    MatTableModule, 
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule ,
    MatRadioModule,
    MatMenuModule,
    MatButtonModule,
    MatExpansionModule
  ],
  providers: [PeriodService],
  templateUrl: './view-students.component.html',
  styleUrl: './view-students.component.css'
})
export class ViewStudentsComponent implements OnInit {

  @ViewChild('paginator1') paginator1: MatPaginator; @ViewChild('sort1') sort1: MatSort;
  @ViewChild('paginator2') paginator2: MatPaginator; @ViewChild('sort2') sort2: MatSort;
    constructor(
      private _formBuilder: FormBuilder,
      public periodService: PeriodService,
      private cookieService: CookieService,
      private el: ElementRef, private renderer: Renderer2
    ) {}
    
    editStudentFormGroup: FormGroup;
    student: any;
    studentList: any;
    studentListMat: any;
    studentListMatResponsive: any;

    registrationList: any;
    registrationListMat: any;

    showdialog: boolean = false;
    showeditdialog: boolean = false;
    showProfileDialog: boolean = false;
    dataSource: any;
    onPeriod: any[];
    public profileStudent: any;
    readonly startDate = new Date(2005, 0, 1);

  paginatedStudentList = [];

   displayedColumns: string[] = ['cedula', 'name', 'last_name', 'phone', 'Acciones'];

    min: number;
    max: number;
  
    history: any;

    
  
    ngOnInit() {
      this.initializeFormGroups();
      this.loadList(); 
      this.history = this.getPersonIdAndUserIdFromCookie();   
  
    }

    
  
  
    openEditDialog() {
      this.showeditdialog = true;
    }

    openProfileDialog() {
      this.showProfileDialog = true;
    }


    initializeFormGroups() {
      this.editStudentFormGroup = this._formBuilder.group({
        nationality: ["",Validators.required],
        id: ['0'],
        cedula: ["", Validators.required],
        name: ["", Validators.required],
        second_name: ["35"],
        last_name: ["",Validators.required],
        second_last_name: ["35"],
        email: ["",Validators.required],
        phone: ["",Validators.required, this.customPatternValidator(/^(\+58)?-?([04]\d{3})?-?(\d{3})-?(\d{4})\b/)],
        gender: ["",Validators.required],
        birthday: ["",Validators.required],
        address: ["",Validators.required],
      });
    }

    onEditList(id: string) {
      this.openEditDialog();
      const selectedId = id;
      const selectedStudent = this.studentList.find(p => p.id === selectedId);
      if (selectedStudent) {
        this.editStudentFormGroup.patchValue({
          id: selectedStudent.id,
          nationality: selectedStudent.nationality,
          cedula: selectedStudent.cedula ,
          name: selectedStudent.name,
          second_name: selectedStudent.second_name,
          last_name: selectedStudent.last_name,
          second_last_name: selectedStudent.second_last_name,
          email: selectedStudent.email,
          phone: selectedStudent.phone,
          gender: selectedStudent.gender,
          birthday: selectedStudent.birthday,
          address: selectedStudent.address,
        });
      }
    }  

    onProfileList(id: string) {
      this.openProfileDialog();
      const selectedId = id;
       this.profileStudent = this.studentList.find(p => p.id === selectedId);
       this.registrationList = this.profileStudent.registration;
       this.registrationListMat = new MatTableDataSource<RegistrationList>(this.registrationList);
      }  
    
  
    hideEditDialog() {
      this.showeditdialog = false;
    }

    hideProfileDialog() {
      this.showProfileDialog = false;
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
      doc.text('Reportes: Estudiantes del Sistema', 50, 30);

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
          //console.log(data.cell.raw);
        }
      });

      // Mostrar la última columna de nuevo
      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 0) {
          this.renderer.setStyle(cells[cells.length - 1], 'display', '');
        }
      });

      doc.save('reporte_estudiantes.pdf');
    };
  }
  
    async studentListRecover() {
      try {
        const response = await fetch(
          "http://localhost/jfb_rest_api/server.php?student_list"
        );
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.status);
        }
        const data = await response.json();
        //console.log("Datos recibidos:", data);
        return data; // Devuelve los datos
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    }

    probar(id: string){
      const selectedId = id;
      //console.log(selectedId);
    }
    
  
      async loadList() {
        try {
          await this.periodService.loadPeriod(); // Espera a que los datos se carguen
          this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod  
  
          this.studentList = await this.studentListRecover();    
          this.studentListMat = new MatTableDataSource<Student>(this.studentList);
          this.studentListMatResponsive = new MatTableDataSource<Student>(this.studentList);
          this.studentListMat.paginator = this.paginator1;  
          this.studentListMat.sort = this.sort1;


          ////////////////////////RESPONSIVE////////////////////////////
          this.studentListMatResponsive.paginator = this.paginator2;  
          this.studentListMatResponsive.sort = this.sort2;
          this.applyPaginator();
          ////////////////////////END RESPONSIVE////////////////////////////

        } catch (error) {
          console.error('Error al recuperar los datos de la lista:', error);
          // Maneja el error según tus necesidades
        }
    
        //this.dataSource = new MatTableDataSource(this.sectionList);
        //this.dataSource.paginator = this.paginator;
      }


      editStudent(){
        const datos = {
          editStudent: "",
          student: this.editStudentFormGroup.value,
          history: this.history
        };
    
        if (this.editStudentFormGroup.valid) {
          // El formulario tiene valores válidos
          // Aquí envia los datos al backend
          fetch('http://localhost/jfb_rest_api/server.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
          })
          .then(response => response.json())
          .then(data => {
        
            //console.log(data);
            Swal.fire({
              title: 'Estudiante editado!',
              text: 'Este estudiante ha sido editado con exito.',
              icon: 'success'
            });
            this.loadList();
            this.hideEditDialog()
    
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


firstLetterUpperCase(word: string): string {
return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
} 

 capitalizeWords(str : string) : string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}
    
    
//////////////////VALIDACIONES///////////////////////////////

customPatternValidator(pattern: RegExp) {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    return new Promise((resolve) => {
      if (pattern.test(control.value)) {
        resolve(null); // Valor válido
      } else {
        resolve({ customPattern: true }); // Valor no válido
      }
    });
  };
}



////////////////////////////////////////////////////////////


//////////////////////////////////////////////////CEDULA EMPIEZA CON V//////////////////////////

selectedNationality = 'V-'; // Valor predeterminado

nationality = [
  { value: 'V-', label: 'V' },
  { value: 'E-', label: 'E' },
];





////////////////////////////////////USER HISTORY ///////////////////////////////////

getPersonIdAndUserIdFromCookie() { 
  const person_id = this.cookieService.get('person_id'); 
  const user = this.cookieService.get('user_id'); 
  
  return { person_id, user }; 
}


////////////////////RESPONSIVE PAGINATION//////////////////////////////////////////



applyPaginator() {
  const pageIndex = this.paginator2.pageIndex;
  const pageSize = this.paginator2.pageSize;
  const filteredData = this.studentListMatResponsive.filteredData;
  const startIndex = pageIndex * pageSize;
  this.paginatedStudentList = filteredData.slice(startIndex, startIndex + pageSize);
  //console.log('Paginated Data:', this.paginatedStudentList);
}


applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.studentListMat.filter = filterValue.trim().toLowerCase();
  this.studentListMatResponsive.filter = filterValue.trim().toLowerCase();

  if (this.studentListMatResponsive.paginator2) {
    this.studentListMatResponsive.paginator2.firstPage();
  }

  this.applyPaginator();
}


}




