import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
  
})

export class LoginComponent implements OnInit {

  email : string;
  password : string;

  //constructor(private auth : AuthService) { }

  ngOnInit(): void {

    

  }
  constructor(private cookieService: CookieService,private router: Router) {};


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
      this.cookieService.set('user_id', data.user_id);
      this.cookieService.set('isAdmin', data.isAdmin);
      this.router.navigate(['/app/dashboard']);
    }
    // "Receta guardada correctamente"
  })
  .catch(error => {
    console.error('Error:', error);
  });
  }

  OnSignInWithGoogle(){ 
    //this.auth.googleSignIn();
  }

}
