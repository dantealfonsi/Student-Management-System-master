
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, viewChild, ElementRef } from "@angular/core";
import { Config } from "datatables.net-dt";
import "datatables.net-buttons-dt";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
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
import { Observable, Subject } from "rxjs";
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
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import { DatePipe } from '@angular/common';

interface Teacher {
  cedula: string;
  name: string;
  last_name: string;
  phone: string;
  teacherData: {
    id: string;
    total_work_charge: number;
    qualification: string;
    degree: string;
    second_qualification: string;
    second_degree: string;
    hiring: string;
    dissmisal: string;
  }
}

@Component({
  selector: 'view-teacher',
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
    MatButtonModule
  ],
  templateUrl: './view-teacher.component.html',
  styleUrl: './view-teacher.component.css'
})




export class ViewTeacherComponent {

  
  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    constructor(
      private _formBuilder: FormBuilder,
      public periodService: PeriodService,
      private datePipe: DatePipe
    ) {}
    
    editTeacherFormGroup: FormGroup;
    teacher: any;
    teacherList: any;
    teacherListMat: any;

    registrationList: any;
    registrationListMat: any;


/////// Array para almacenar las carreras //////////////
    
    degreeList: any[];
    secondDegreeList : any[];

    filteredOptions: Observable<string[]>;
    secondFilteredOptions: Observable<string[]>;

    myControl = new FormControl();
    mySecondControl = new FormControl();

    public value: string = '';

/////////////////////////////////////////////////////////////
    
    showdialog: boolean = false;
    showeditdialog: boolean = false;
    showProfileDialog: boolean = false;
    dataSource: any;
    onPeriod: any[];
    public profileTeacher: any;
    readonly startDate = new Date(2005, 0, 1);

    min: number;
    max: number;
  
  
    ngOnInit() {
      this.initializeFormGroups();
      this.leerArchivoCarreras();

      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
      this.secondFilteredOptions = this.mySecondControl.valueChanges.pipe(
        startWith(''),
        map(value => this.second_filter(value || '')),
      );

      // Sincronizar myControl con el control del formulario
     
        this.myControl.valueChanges.subscribe(value => {
        this.editTeacherFormGroup.get('degree').setValue(value, { emitEvent: false });
      });

      this.mySecondControl.valueChanges.subscribe(value => {
        this.editTeacherFormGroup.get('second_degree').setValue(value, { emitEvent: false });
      });

      this.editTeacherFormGroup.get('degree').valueChanges.subscribe(value => {
        this.myControl.setValue(value, { emitEvent: false });
      });

      this.editTeacherFormGroup.get('second_degree').valueChanges.subscribe(value => {
        this.mySecondControl.setValue(value, { emitEvent: false });
      });
        
        this.loadList();   
    }
  
  
  
  
    openEditDialog() {
      this.showeditdialog = true;
    }

    openProfileDialog() {
      this.showProfileDialog = true;
    }


    initializeFormGroups() {
      this.editTeacherFormGroup = this._formBuilder.group({
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
        total_work_charge: [Validators.required],
        qualification: ["",Validators.required],
        degree: ["",Validators.required],
        second_qualification: [""],
        second_degree: [""],
      });
    }

    onEditList(id: string) {
      this.openEditDialog();
      const selectedId = id;
      const selectedTeacher = this.teacherList.find(p => p.id === selectedId);
      if (selectedTeacher) {
        this.editTeacherFormGroup.patchValue({
          id: selectedTeacher.id,
          nationality: selectedTeacher.nationality,
          cedula: selectedTeacher.cedula ,
          name: selectedTeacher.name,
          second_name: selectedTeacher.second_name,
          last_name: selectedTeacher.last_name,
          second_last_name: selectedTeacher.second_last_name,
          email: selectedTeacher.email,
          phone: selectedTeacher.phone,
          gender: selectedTeacher.gender,
          birthday: selectedTeacher.birthday,
          address: selectedTeacher.address,
          total_work_charge: selectedTeacher.teacherData.total_work_charge,
          qualification: selectedTeacher.teacherData.qualification,
          degree: selectedTeacher.teacherData.degree,
          second_qualification: selectedTeacher.teacherData.second_qualification,
          second_degree: selectedTeacher.teacherData.second_degree,
        });
      }
    }  

    ///////LEER DEL ARCHIVO DE TITULOS//////////////////////

  leerArchivoCarreras() {
    const rutaArchivo = './assets/carreras.txt';

    fetch(rutaArchivo)
      .then(response => response.text())
      .then(data => {
        this.degreeList = data.split('\n');
        this.secondDegreeList = data.split('\n');

        console.log(this.degreeList);
        console.log(this.secondDegreeList);

      })
      .catch(error => console.error('Error al leer el archivo:', error));
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.degreeList.filter(option => option.toLowerCase().includes(filterValue));
  }

  private second_filter(value: string): string[] {
    const secondFilterValue = value.toLowerCase();
    return this.secondDegreeList.filter(option => option.toLowerCase().includes(secondFilterValue));
  }

  displayOption(option: any): string {
    return option;
  }
////////////////////////////////////////////////////////////////////////////////////////////



    onProfileList(id: string) {
      this.openProfileDialog();
      const selectedId = id;
       this.profileTeacher = this.teacherList.find(p => p.id === selectedId);
      }  
    
  
    hideEditDialog() {
      this.showeditdialog = false;
    }

    hideProfileDialog() {
      this.showProfileDialog = false;
    }
  
    

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.teacherListMat.filter = filterValue.trim().toLowerCase();
  }

  downloadPdf(){
    var doc = new jsPDF();

      autoTable(doc,{html:"#content"});
      doc.save("testPdf");
  }
  
    async teacherListRecover() {
      try {
        const response = await fetch(
          "http://localhost/jfb_rest_api/server.php?teacher_list"
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

    probar(id: string){
      const selectedId = id;
      console.log(selectedId);
    }
    
  
      async loadList() {
        try {
          await this.periodService.loadPeriod(); // Espera a que los datos se carguen
          this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod  
          this.teacherList = await this.teacherListRecover();    
          this.teacherListMat = new MatTableDataSource<Teacher>(this.teacherList);
          this.teacherListMat.paginator = this.paginator;  
          this.teacherListMat.sort = this.sort;
        } catch (error) {
          console.error('Error al recuperar los datos de la lista:', error);
          // Maneja el error según tus necesidades
        }
    
        //this.dataSource = new MatTableDataSource(this.sectionList);
        //this.dataSource.paginator = this.paginator;
      }


      editTeacher(){
        const datos = {
          editTeacher: "",
          teacher: this.editTeacherFormGroup.value
        };
    
        if (this.editTeacherFormGroup.valid) {
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
              title: 'Profesor editado!',
              text: 'Este Profesor ha sido editado con exito.',
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


      dismiss(id: any): void {

        const datos = {
          dismiss: '',
          id:  id,
        };
      
        console.log('Datos antes de enviar:', datos);
      
        Swal.fire({
          title: "¿Estás seguro de despedir a este profesor?",
          text: "¡Este profesor no seguirá apareciendo en la lista!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, despídelo!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "¡Completado!",
              text: "El profesor ha sido despedido.",
              icon: "success"
            });
      
            fetch('http://localhost/jfb_rest_api/server.php', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(datos)
            })
            .then(response => response.json()) // Cambiado a .text() para ver la respuesta completa
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


}



