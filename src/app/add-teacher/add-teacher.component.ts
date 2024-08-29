import { Component, ViewChild, OnInit} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import {readFileSync, promises as fsPromises} from 'fs';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-teacher',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './add-teacher.component.html',
  styleUrl: './add-teacher.component.css'
})
export class AddTeacherComponent {

  selected = 'Tutor Legal';

  @ViewChild('stepper') private stepper: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  onPeriod: any[];
  sortedSectionList: any;
  degreeList: any[]; // Array para almacenar las carreras
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('');

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear - 100, 0, 1);
  readonly maxDateParent = new Date(this._currentYear - 18, 0, 1);
  readonly maxDateStudent = new Date(2017, 0, 1); // Por ejemplo, 01/01/1900

  private onChange: (value: string) => void = () => {};
  private onTouch: () => void = () => {};
  public value: string = '';
  



  constructor(private _formBuilder: FormBuilder) {}
  sectionOptions: string[];
  parent : any[];
  student: any[];
  
  ngOnInit() {
    this.initializeFormGroups();
    this.leerArchivoCarreras();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  initializeFormGroups() {
    this.firstFormGroup = this._formBuilder.group({
      nationality: ['', Validators.required],
      cedula: ['', Validators.required,this.customPatternValidator(/^[0-9]{1,2}-?[.]?[0-9]{3}-?[.]?[0-9]{3}$/) ],
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
      total_work_charge: ['', Validators.required],
      qualification: ['', Validators.required],
      degree: ['', Validators.required],
      second_degree: [''],
      second_qualification: ['']    
    });
    
  }




///////////////////////READ TXT FILE////////////////

leerArchivoCarreras() {
  // Ruta relativa al archivo carreras.txt (por ejemplo, en la carpeta assets)
  const rutaArchivo = './assets/carreras.txt';

  // Leer el archivo
  fetch(rutaArchivo)
    .then(response => response.text())
    .then(data => {
      // Dividir el contenido en líneas
      this.degreeList = data.split('\n');
      console.log(this.degreeList);
    })
    .catch(error => console.error('Error al leer el archivo:', error));
}



displayOption(option: any): string {
  return option;
}

//////////////////VALIDACIONES///////////////////////////////

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



////////////////////////////////////////////////////////////



private _filter(value: string): string[] {
  const filterValue = value.toLowerCase();

  return this.degreeList.filter(option => option.toLowerCase().includes(filterValue));
}




  goForward() { 
    this.stepper.next();
  }
  
  goBack() {
    this.stepper.previous();
  }
  
  generateSectionOptions(): string[] {
    let options = [];
    for (let i = 0; i < 26; i++) {
      let section = String.fromCharCode(65 + i); // ASCII code for uppercase letters
      options.push(section);
    }
    return options;
  }



  onYearStudentChange(event:any){
    alert(event);
  }

  onCedulaChange(event: any) {

    const selectedCedula = event.target.value;
    const selectedParent = this.parent.find(p => p.cedula === selectedCedula);
  
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

  onCedulaStudentChange(event: any) {

    const selectedCedula = event.target.value;
    const selectedParent = this.student.find(p => p.cedula === selectedCedula);
  
    if (selectedParent) {
      this.secondFormGroup.patchValue({
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


  /////////////////////////////REGISTRAR///////////////////////////////


  register_teacher(){

    const datos = {
      register_teacher: "",
      person: this.firstFormGroup.value,
      teacher: this.secondFormGroup.value,
    };

    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      // El formulario tiene valores válidos
      console.log('Inscripcion de Profesor ', datos);
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
        console.log("Estoy aqui: ",data);
        Swal.fire({
          title: '¡Nuevo Mensaje!',
          text: data['message'],
          icon: data['icon']
        }).then(() => {
          if (!data['message'].includes('Error')) {
            location.reload();
          }
        }); 
      })
      .catch(error => {
        console.error('Error:', error);
      });

    } else { 
      // El formulario no tiene valores válidos
      Swal.fire({
        title: '¡Nuevo Mensaje!',
        text: "Formulario inválido",
        icon: "error"
      });
    }    
  }



  firstLetterUpperCase(word: string): string {
    return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
}  


//////////////////////////////////////////////////CEDULA EMPIEZA CON V//////////////////////////

selectedNationality = 'V-'; // Valor predeterminado

nationality = [
  { value: 'V-', label: 'V' },
  { value: 'E-', label: 'E' },
];
  
}
