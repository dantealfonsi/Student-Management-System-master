import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-add-user',
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
    MatNativeDateModule,
    MatRadioModule,
    MatMenuModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatTooltipModule,
    RouterOutlet,
    RouterModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})


export class AddUserComponent implements OnInit {


  ////////////////PAGINATION//////////////////

  @ViewChild('stepper') private stepper: MatStepper;

  ///////////////////END PAGINATION//////////////


  /////////FORM VARIABLES////////////////

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  /////////END FORM VARIABLES////////////////

  /////////DATE VARIABLES////////////////

  formattedDate: string;
  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear - 100, 0, 1);
  readonly maxDate = new Date(this._currentYear - 18, 0, 1);

  /////////END DATE VARIABLES////////////////

  /////////COMMON VARIABLES////////////////

  person: any[];
  history: any;
  selected = 'Tutor Legal';

  /////////END COMMON VARIABLES////////////////




  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private cookieService: CookieService) { }


  ngOnInit() {
    this.initializeFormGroups();
    this.loadParentList();
    this.notAdmin();
    this.history = this.getPersonIdAndUserIdFromCookie();
  }


  //////////////FORM CONTROLLERS/////////////

  initializeFormGroups() {
    this.firstFormGroup = this._formBuilder.group({
      nationality: ['', Validators.required],
      cedula: ['', Validators.required, this.customPatternValidator(/^[0-9]{1,2}-?[.]?[0-9]{3}-?[.]?[0-9]{3}$/)],
      name: ['', Validators.required],
      second_name: [''],
      last_name: ['', Validators.required],
      second_last_name: [''],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required, this.customPatternValidator(/^(\+58)?-?([04]\d{3})?-?(\d{3})-?(\d{4})\b/)],
      birthday: ['', Validators.required],
      address: ['', Validators.required],
    });

    this.secondFormGroup = this._formBuilder.group({
      // Repite los campos del primer paso si es necesario
      user_name: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[A-Za-z])[0-9A-Za-z!@#$%]{8,20}$/)]],
      confirmPassword: ['', Validators.required],
      isAdmin: [''],
    }, { validators: AddUserComponent.MatchValidator('password', 'confirmPassword') }
    )
  }

  //////////////END FORM CONTROLLERS/////////////


  //////////////QUERY CONTROLLERS/////////////

  async loadParentList() {

    this.person = await this.person_list_recover();
    // ... cualquier otra lógica que dependa de 'parent'
  }


  async person_list_recover() {
    try {
      const response = await fetch('http://localhost/jfb_rest_api/server.php?person_list=');
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


  onYearStudentChange(event: any) {
    alert(event);
  }

  onCedulaChange(event: any) {

    const selectedCedula = event.target.value;
    const selectedParent = this.person.find(p => p.cedula === selectedCedula);

    if (selectedParent) {
      this.firstFormGroup.patchValue({
        cedula: selectedParent.cedula,
        name: selectedParent.name,
        second_name: selectedParent.second_name,
        last_name: selectedParent.last_name,
        second_last_name: selectedParent.second_last_name,
        gender: selectedParent.gender,
        email: selectedParent.email,
        phone: selectedParent.phone,
        birthday: selectedParent.birthday,
        address: selectedParent.address
      });
    }
  }

  //////////////END QUERY CONTROLLERS/////////////

  //////////////OPERATION CONTROLLERS/////////////


  addUser() {
    const datos = {
      addUser: "",
      person: this.firstFormGroup.value,
      userData: this.secondFormGroup.value,
      history: this.history

    };

    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      // El formulario tiene valores válidos
      console.log('Formulario de Inscripción');
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

          Swal.fire({
            title: 'Mensaje!',
            text: data['message'],
            icon: data['icon']
          }).then(() => {
            if (!data['message'].includes('Error')) {
              this.router.navigate(['/app/viewUsers']);
            }
          });

        }).then()
        .catch(error => {
          console.error('Error:', error);
        });

    } else {
      // El formulario no tiene valores válidos
      alert("Error en el llenado de datos");
      console.log('Formulario inválido');
    }
  }


  //////////////END OPERATIONS CONTROLLERS/////////////



  ///////////////TEXT CONTROLLERS//////////////////////////


  firstLetterUpperCase(word: string): string {
    return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
  }

  selectedNationality = 'V-'; // Valor predeterminado

  nationality = [
    { value: 'V-', label: 'V' },
    { value: 'E-', label: 'E' },
  ];

  ///////////////END TEXT CONTROLLERS//////////////////////////


  ///////////////VALIDATION CONTROLLERS//////////////////////////

  getPasswordError(): string {
    const passwordControl = this.secondFormGroup.get('password');
    if (passwordControl.hasError('required')) {
      return 'La contraseña es obligatoria.';
    }

    if (passwordControl.hasError('pattern')) {
      return 'La contraseña no cumple con los requisitos.';
    }
    return '';
  }

  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }


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

  get passwordMatchError() {
    return (
      this.secondFormGroup.getError('mismatch') &&
      this.secondFormGroup.get('confirmPassword')?.touched
    );
  }

  ///////////////END VALIDATION CONTROLLERS//////////////////////////


  ///////////////////ROUTE CONTROLLERS///////////////////////////

  notAdmin() {
    if (this.cookieService.get('isAdmin') === '0') {
      this.router.navigate(['/app/dashboard']);
    }
  }

  goToView() {
    this.router.navigate(['/app/viewUsers']);
  }

  goForward() {
    this.stepper.next();
  }

  goBack() {
    this.stepper.previous();
  }

  ///////////////////ROUTE CONTROLLERS///////////////////////////

  ///////////////////HISTORY CONTROLLERS///////////////////////////

  getPersonIdAndUserIdFromCookie() {
    const person_id = this.cookieService.get('person_id');
    const user = this.cookieService.get('user_id');

    return { person_id, user };
  }
  ///////////////////END HISTORY CONTROLLERS///////////////////////////


}


