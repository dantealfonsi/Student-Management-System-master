import { Component, ViewChild, OnInit} from '@angular/core';
import { DataService } from '../services/data.service';
import { Student } from '../modal/student';
import { ToastService } from '../services/toastr.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { event } from 'jquery';
import { PeriodService } from '../period.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
  providers: [PeriodService],

})


export class AddStudentComponent implements OnInit {
  
  selected = 'Tutor Legal';

  @ViewChild('stepper') private stepper: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  onPeriod: any[];
  sortedSectionList: any;

  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear - 100, 0, 1);
  readonly maxDateParent = new Date(this._currentYear - 18, 0, 1);
  readonly maxDateStudent = new Date(2017, 0, 1); // Por ejemplo, 01/01/1900

  private onChange: (value: string) => void = () => {};
  private onTouch: () => void = () => {};
  public value: string = '';
  



  constructor(private _formBuilder: FormBuilder,public periodService: PeriodService) {}
  sectionOptions: string[];
  parent : any[];
  student: any[];
  
  ngOnInit() {
    this.initializeFormGroups();
    this.loadParentList();
    this.sectionOptions = this.generateSectionOptions(); 
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
      student_rel: ['',Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
  
      // Repite los campos del primer paso si es necesario
      nationality: ['', Validators.required],
      cedula: ['', Validators.required,this.customPatternValidator(/^[0-9]{1,2}-?[.]?[0-9]{3}-?[.]?[0-9]{3}$/)],
      name: ['', Validators.required],
      second_name: [''],
      last_name: ['', Validators.required],
      second_last_name: [''],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required, this.customPatternValidator(/^(\+58)?-?([04]\d{3})?-?(\d{3})-?(\d{4})\b/)],
      birthday: ['', Validators.required],
      address: ['', Validators.required]
    });
    
    this.thirdFormGroup = this._formBuilder.group({
      year: ['', Validators.required],
      section: ['', Validators.required]
    });
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



  async loadParentList() {
    this.parent = await this.parent_list_recover();
    this.student = await this.student_list_recover();
    this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod
    // ... cualquier otra lógica que dependa de 'parent'
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

  async parent_list_recover() {
    try {
      const response = await fetch('http://localhost/jfb_rest_api/server.php?parent_list=');
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

  async student_list_recover() {
    try {
      const response = await fetch('http://localhost/jfb_rest_api/server.php?student_list=');
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

  

  async sorted_section_list_recover(event) {
    try {
      const response = await fetch("http://localhost/jfb_rest_api/server.php?sorted_section_list=&year="+event+"&period="+this.onPeriod['current_period']
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      console.log("Datos recibidos:", data);
      this.sortedSectionList = data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
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

  inscribe(){
    const datos = {
      inscribe: "",
      parent: this.firstFormGroup.value,
      student: this.secondFormGroup.value,
      other: this.thirdFormGroup.value,
      period: this.onPeriod['current_period'] 
    };

    if (this.firstFormGroup.valid && this.secondFormGroup.valid  && this.thirdFormGroup.valid) {
      // El formulario tiene valores válidos
      console.log('Formulario de Inscripción',datos);
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










