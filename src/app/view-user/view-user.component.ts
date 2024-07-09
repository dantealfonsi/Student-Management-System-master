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
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Router, RouterModule,RouterLink } from "@angular/router";
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

interface User {
  user_id: string;  
  username: string;
  password: string;
  isAdmin: string;
  isBlocked: string;
  person_id:{
    name: string;
    Last_name: string;
}
}


@Component({
  selector: 'app-view-user',
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
    MatSlideToggleModule,
    RouterOutlet,
    RouterModule,
    RouterLink,
  ],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent {





  constructor(private router: Router,private _formBuilder: FormBuilder,private cookieService: CookieService) {}
  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  userList: any;
  userListMat: any;
  checked: unknown;
  addUsers: string|any[];
  showeditdialog: boolean = false;
  editUserFormGroup: FormGroup;

  goToAdd(){
    this.router.navigate(['/app/addUsers']);
  }
  


  ngOnInit() {
    this.loadList();   
    this.initializeFormGroups();
  }

  initializeFormGroups() {
    this.editUserFormGroup = this._formBuilder.group({
      id: ['0'],
      user_name: ["", Validators.required],
      password: [""],
      isAdmin: ["",Validators.required]
    });
  }

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userListMat.filter = filterValue.trim().toLowerCase();
  }

  downloadPdf(){
    var doc = new jsPDF();

      autoTable(doc,{html:"#content"});
      doc.save("testPdf");
  }


  async userListRecover() {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?user_list"
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

  blockUser(id:any){
    //si el valor de isBlocked es 1 lo cambia a cero y viceversa
    let valor='1';
    let elemento: any = this.userList.find((e: any) => e.user_id === id);
    
    if(elemento.isBlocked==='1') valor='0';

    //reyeno la ata a enviar
    const datos = {
      update: id,
      tabla: "user",
      campo: "isBlocked",
      valor: valor
    };

    fetch('http://localhost/jfb_rest_api/server.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
      .then(response => response.json())
      .then(data => {        
        //si todo va bien actualizo el array de la lista
        elemento.isBlocked = valor;
      })
      .catch(error => {
        console.error('Error:', error);
    });     
  }

  async loadList() {
    try {

      this.userList = await this.userListRecover();    
      this.userListMat = new MatTableDataSource<User>(this.userList);
      this.userListMat.paginator = this.paginator;  
      this.userListMat.sort = this.sort;

    } catch (error) {
      console.error('Error al recuperar los datos de la lista:', error);
      // Maneja el error según tus necesidades
    }

    //this.dataSource = new MatTableDataSource(this.sectionList);
    //this.dataSource.paginator = this.paginator;
  }
  

  
  openEditDialog() {
    this.showeditdialog = true;
  }


  hideEditDialog() {
    this.showeditdialog = false;
  }


  onUserList(id: string) {
    this.openEditDialog();
    const selectedId = id;
    const selectedUser = this.userList.find(p => p.user_id === selectedId);
    if (selectedUser) {
      this.editUserFormGroup.patchValue({
        id: selectedUser.user_id,
        user_name: selectedUser.user_name ,
        //password: selectedUser.password,
        isAdmin: parseInt(selectedUser.isAdmin, 10)
      });
    }
    console.log("aqui es:", this.editUserFormGroup.value)
  }  


  editUser(){
    const datos = {
      editUser: "",
      user: this.editUserFormGroup.value
    };

    if (this.editUserFormGroup.valid) {
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
          title: 'Usuario editado!',
          text: 'El Usuario fue editado con exito.',
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

  rol(value : string) {

      if(value === '0') return 'Usuario';
      else return 'Administrador';
  }




  onDropList(id: any) {
    const datos = {
      update: id,
      tabla: "user",
      campo: "isDeleted",
      valor: 1
    };

    Swal.fire({
      title: "¿Estás seguro de deshabilitarlo?",
      text: "¡Este usuario no seguirá apareciendo en la lista!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Deshabilítalo"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Completado!",
          text: "El usuario ha sido deshabilitado.",
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
          // Si todo va bien, actualizo el array de la lista
          this.loadList();
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  }


  readCookie(){
    return this.cookieService.get('user_id');
  }



















}
