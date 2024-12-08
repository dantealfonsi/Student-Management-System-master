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

interface Parent {
  cedula: string;
  name: string;
  last_name: string;
  phone: string;
}


interface RegistrationList{
  student_rel: string;
  student_id:{
    name: string;
    last_name: string;
  },
  year: string,
  section_id:{
    name: string;
  },
  period: string
}



@Component({
  selector: 'app-view-parent',
  standalone: true,
  imports: [ MatFormFieldModule,
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
    MatButtonModule],
  providers: [PeriodService],

  templateUrl: './view-parent.component.html',
  styleUrl: './view-parent.component.css'
})
export class ViewParentComponent {

  
  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  registrationList: any;
  registrationListMat: MatTableDataSource<RegistrationList, MatPaginator>;

    constructor(
      private _formBuilder: FormBuilder,
      public periodService: PeriodService,
      private cookieService: CookieService,
      private el: ElementRef, private renderer: Renderer2
    ) {}
    
    editParentFormGroup: FormGroup;
    parent: any;
    parentList: any;
    parentListMat: any;
    showdialog: boolean = false;
    showeditdialog: boolean = false;
    dataSource: any;
    onPeriod: any[];
    readonly startDate = new Date(2005, 0, 1);

    public profileParent: any;

    showProfileDialog: boolean = false;

    min: number;
    max: number;
    history: any;
  
  
    ngOnInit() {
      this.initializeFormGroups();
      this.loadList();
      this.history = this.getPersonIdAndUserIdFromCookie();   
    }
  

    initializeFormGroups() {
      this.editParentFormGroup = this._formBuilder.group({
        id: ['0'],
        nationality: ["",Validators.required],
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


    openEditDialog() {
      this.showeditdialog = true;
    }

    hideEditDialog() {
      this.showeditdialog = false;
    }

    onProfileList(id: string) {
      this.openProfileDialog();
      const selectedId = id;
       this.profileParent = this.parentList.find(p => p.id === selectedId);
       this.registrationList = this.profileParent.profileData;
       this.registrationListMat = new MatTableDataSource<RegistrationList>(this.registrationList);
      }  
    
      
    openProfileDialog() {
      this.showProfileDialog = true;
    }


      hideProfileDialog() {
        this.showProfileDialog = false;
      }
    
  

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.parentListMat.filter = filterValue.trim().toLowerCase();
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
        doc.text('Reportes: Representantes del Plantel', 50, 30);
  
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
  
        doc.save('reporte_representantes.pdf');
      };
    }

    
      async parentListRecover() {
        try {
          const response = await fetch(
            "http://localhost/jfb_rest_api/server.php?parent_list"
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


      async loadList() {
        try {
          await this.periodService.loadPeriod(); // Espera a que los datos se carguen
          this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod  
  
          
          this.parentList = await this.parentListRecover();    
          this.parentListMat = new MatTableDataSource<Parent>(this.parentList);
          this.parentListMat.paginator = this.paginator;  
          this.parentListMat.sort = this.sort;
  
        } catch (error) {
          console.error('Error al recuperar los datos de la lista:', error);
          // Maneja el error según tus necesidades
        }
    
        //this.dataSource = new MatTableDataSource(this.sectionList);
        //this.dataSource.paginator = this.paginator;
      }


      editParent(){
        const datos = {
          editParent: "",
          student: this.editParentFormGroup.value,
          history: this.history
        };
    
        if (this.editParentFormGroup.valid) {
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
        
            console.log(data);
            Swal.fire({
              title: 'Representante editado!',
              text: 'Este Representante ha sido editado con exito.',
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

      onEditList(id: string) {
        this.openEditDialog();
        const selectedId = id;
        const selectedStudent = this.parentList.find(p => p.id === selectedId);
        if (selectedStudent) {
          this.editParentFormGroup.patchValue({
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
  
      firstLetterUpperCase(word: string): string {
        return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
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


   capitalizeWords(str : string) : string {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
      


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


}
