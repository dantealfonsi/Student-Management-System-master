import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
  
})

export class LoginComponent {

  email : string = '';
  password : string = '';
  fechaSistema: Date; 
  mesActual: number; 
  añoActual: number;  
  isWithinPeriod: boolean;

  //constructor(private auth : AuthService) { }


  constructor(private cookieService: CookieService,private router: Router) {};

  ngOnInit(): void { 
    this.obtenerFechaSistema(); 
  }

  obtenerFechaSistema(): void { 
    this.fechaSistema = new Date(); 
    this.mesActual = this.fechaSistema.getMonth() + 1; // Los meses en JavaScript son 0-indexados, por eso sumamos 1 
    this.añoActual = this.fechaSistema.getFullYear(); 
  }

  isDateWithinPeriod(start_current_period: string, end_current_period: string): boolean {
    const currentDate = new Date();
    const startDate = new Date(start_current_period);
    const endDate = new Date(end_current_period);
  
    return currentDate >= startDate && currentDate <= endDate;
  }
  

  async OnUserLogin(){ 
    if (this.email == ''){
      Swal.fire({
        title: 'Introduce un email!',
        text: 'Este usuario no existe.',
        icon: 'warning'
      });         
      return;
    }

    if (this.password == ''){
      Swal.fire({
        title: 'Introduce una contraseña!',
        text: 'Este usuario no existe.',
        icon: 'warning'
      });          
      return;
    }

    const datos = {
      login: "",
      user: this.email,
      password: this.password      
  };

  await fetch('http://localhost/jfb_rest_api/server.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
  .then(response => response.json())
  .then(data => {

    console.log(data);
    if(data.exists === false){
      Swal.fire({
        title: '¡Usuario Inexistente!',
        text: 'Este usuario no existe.',
        icon: 'warning'
      });    
      return;
    }
    if(data.pass === false){
      Swal.fire({
        title: 'Contraseña Incorrecta!',
        text: 'Esta contraseña no corresponde al usuario.',
        icon: 'error'
      });    
      return;
    }else{
      if(this.isDateWithinPeriod(data.period.start_current_period, data.period.end_current_period)){
        this.cookieService.set('user_id', data.user_id);
        this.cookieService.set('isAdmin', data.isAdmin);      
        this.router.navigate(['/app/dashboard']);
      }else{
        this.router.navigate(['/period']);
      }
    }
    // "Receta guardada correctamente"
  })
  .catch(error => {
    console.error('Error:', error);
  });
  }
}
