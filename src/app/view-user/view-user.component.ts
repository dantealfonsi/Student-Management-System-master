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

interface User {
  id: string;  
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


  constructor(private router: Router) {}
  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  userList: any;
  userListMat: any;
  checked: unknown;
  addUsers: string|any[];
  
  goToAdd(){
    this.router.navigate(['/app/addUsers']);
  }
  
  ngOnInit() {
    this.loadList();   
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
  



}
