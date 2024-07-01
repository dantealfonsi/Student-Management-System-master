import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, viewChild, ElementRef } from "@angular/core";
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
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, provideNativeDateAdapter} from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';

interface Student {
  cedula: string;
  name: string;
  last_name: string;
  phone: string;
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
    MatRadioModule
  ],
  providers: [PeriodService],
  templateUrl: './view-students.component.html',
  styleUrl: './view-students.component.css'
})
export class ViewStudentsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    constructor(
      private _formBuilder: FormBuilder,
      public periodService: PeriodService,
    ) {}
    
    editStudentFormGroup: FormGroup;
    student: any;
    studentList: any;
    studentListMat: any;
    showdialog: boolean = false;
    showeditdialog: boolean = false;
    dataSource: any;
    onPeriod: any[];
    readonly startDate = new Date(2005, 0, 1);

    min: number;
    max: number;
  
  
    ngOnInit() {
      this.initializeFormGroups();
      this.loadList();   
    }
  
  
  
  
    openEditDialog() {
      this.showeditdialog = true;
    }

    initializeFormGroups() {
      this.editStudentFormGroup = this._formBuilder.group({
        id: ['0'],
        cedula: ["", Validators.required],
        name: ["", Validators.required],
        second_name: ["35"],
        last_name: ["",Validators.required],
        second_last_name: ["",Validators.required],
        email: ["",Validators.required],
        phone: ["",Validators.required],
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
    
  
    hideEditDialog() {
      this.showeditdialog = false;
    }
  
    

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.studentListMat.filter = filterValue.trim().toLowerCase();
  }

  downloadPdf(){
    var doc = new jsPDF();

      autoTable(doc,{html:"#content"});
      doc.save("testPdf");
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
        console.log("Datos recibidos:", data);
        return data; // Devuelve los datos
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    }

    probar(){
      console.log(this.studentList);
    }
    
  
      async loadList() {
        try {
          await this.periodService.loadPeriod(); // Espera a que los datos se carguen
          this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod  
  
          this.studentList = await this.studentListRecover();    
          this.studentListMat = new MatTableDataSource<Student>(this.studentList);
          this.studentListMat.paginator = this.paginator;  
          this.studentListMat.sort = this.sort;
  
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
          student: this.editStudentFormGroup.value
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
        
            console.log(data);
            Swal.fire({
              title: 'Estudiante editado!',
              text: 'Esta contraseña no corresponde al usuario.',
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

}

