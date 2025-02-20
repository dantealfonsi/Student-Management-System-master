import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PeriodService } from '../period.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']

})

export class LoginComponent {

    email: string = '';
    password: string = '';
    fechaSistema: Date;
    mesActual: number;
    añoActual: number;
    isWithinPeriod: boolean;

    onPeriod: any[];
    periodData: any;


    //constructor(private auth : AuthService) { }

    constructor(private cookieService: CookieService, private router: Router, public periodService: PeriodService) { };

    async ngOnInit(): Promise<void> {
        if (this.cookieService.get('user_id')) {
            this.router.navigate(['/app/dashboard']);
        }
        await this.periodService.loadPeriod(); // Espera a que los datos se carguen
        this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod
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

        //console.log(currentDate + "-" + startDate + "-" + endDate);
        return currentDate >= startDate && currentDate <= endDate;
    }

    async OnUserLogin() {
        if (this.email === '') {
            Swal.fire({
                title: 'Introduce un email!',
                text: 'Este usuario no existe.',
                icon: 'warning'
            });
            return;
        }

        if (this.password === '') {
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
                if (data.exists === false) {
                    Swal.fire({
                        title: '¡Usuario Inexistente!',
                        text: 'Este usuario no existe.',
                        icon: 'warning'
                    });
                    return;
                }
                if (data.pass === false) {
                    Swal.fire({
                        title: 'Contraseña Incorrecta!',
                        text: 'Esta contraseña no corresponde al usuario.',
                        icon: 'error'
                    });
                    return;
                }
                else {
                    if (data.period.exist_current_period === false) {
                        // Redirigir a period si current_period está vacío
                        this.cookieService.set('user_id', data.user_id, undefined, '/');
                        this.cookieService.set('isAdmin', data.isAdmin, undefined, '/');
                        this.cookieService.set('person_id', data.person_id, undefined, '/');
                        
                        this.router.navigate(['/period']);
                    } else {
                        // Configurar las cookies con la ruta especificada
                        this.cookieService.set('user_id', data.user_id, undefined, '/');
                        this.cookieService.set('isAdmin', data.isAdmin, undefined, '/');
                        this.cookieService.set('person_id', data.person_id, undefined, '/');
                    
                        if (this.isDateWithinPeriod(data.period.start_current_period, data.period.end_current_period)) {
                            this.router.navigate(['/app/dashboard']);
                        } else {
                            this.router.navigate(['/period']);
                        }
                    }
                }                
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

