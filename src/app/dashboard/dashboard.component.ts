import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {

  cardList: any;

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
      console.log("Datos Registration:", data);
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
