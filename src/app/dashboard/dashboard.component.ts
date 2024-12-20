import { Component, OnInit } from '@angular/core';
import { Dashboard2Component } from '../charts/dashboard-2/dashboard-2.component';
import { Dashboard1Component } from '../charts/dashboard-1/dashboard-1.component';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true, // Agrega esta línea
  imports: [
    CommonModule,
    Dashboard2Component,
    Dashboard1Component,
    MatIcon
],
})


export class DashboardComponent implements OnInit {

  cardList: any;
  reportList: any;

  //constructor(private auth: AuthService) { }

  ngOnInit() {
    this.loadList();   
  }

  async cardListRecover() {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?stadistic"
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      //console.log("Datos Registration:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }




  
  async loadList() {
    try {

      this.cardList = await this.cardListRecover();    

    } catch (error) {
      console.error('Error al recuperar los datos de la lista:', error);
      // Maneja el error según tus necesidades
    }

    //this.dataSource = new MatTableDataSource(this.sectionList);
    //this.dataSource.paginator = this.paginator;
  }


  OnUserLogout(){
    //this.auth.logout();
  }
}
