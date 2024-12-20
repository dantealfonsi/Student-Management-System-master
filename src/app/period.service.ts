import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  
  period: any[]; // Variable global para los períodos
  name_proyect: string = "";

  constructor() {
    this.loadPeriod(); // Llama a loadPeriod() en el constructor
  }

  async loadPeriod() {
    try {
      const response = await fetch('http://localhost/jfb_rest_api/server.php?current_period=');
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      //console.log("Datos recibidos:", data);
      this.period = data; // Asigna los datos a la variable period 
      this.name_proyect = "Hola Mundo";
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }
}