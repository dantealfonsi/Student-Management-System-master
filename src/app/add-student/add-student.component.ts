import { Component, ViewChild, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Student } from '../modal/student';
import { ToastService } from '../services/toastr.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { event } from 'jquery';
import { PeriodService } from '../period.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
  providers: [PeriodService],

})


export class AddStudentComponent implements OnInit {

  /////////////////////////////VIEWCHILDS/////////////////////////////////

  @ViewChild('stepper') private stepper: MatStepper;

  /////////////////////////////END VIEWCHILDS/////////////////////////////////

  /////////////////////////////LIST VARIABLES /////////////////////////////

  sortedSectionList: any;

  /////////////////////////////END LIST VARIABLES /////////////////////////////

  /////////////////////////////FORMGROUPS/////////////////////////////

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  /////////////////////////////END FORMGROUPS/////////////////////////////

  /////////////////////////////TIME VARIABLES/////////////////////////////


  private readonly _currentYear = new Date().getFullYear();
  readonly minDate = new Date(this._currentYear - 100, 0, 1);
  readonly maxDateParent = new Date(this._currentYear - 18, 0, 1);
  readonly maxDateStudent = new Date(2017, 0, 1); // Por ejemplo, 01/01/1900
  private onChange: (value: string) => void = () => { };
  private onTouch: () => void = () => { };
  public value: string = '';

  /////////////////////////////END TIME VARIABLES/////////////////////////////

  /////////////////////////////END  COMMON VARIABLES/////////////////////////////

  selected = 'Tutor Legal';
  onPeriod: any[];
  sectionOptions: string[];
  parent: any[];
  student: any[];
  itemId: string;
  sectionYear: string;
  sectionName: string;
  history: any;

  /////////////////////////////END COMMON VARIABLES/////////////////////////////

  constructor(private _formBuilder: FormBuilder,
    public periodService: PeriodService,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) { }


  ngOnInit() {
    this.initializeFormGroups();
    this.loadParentList();
    this.sectionOptions = this.generateSectionOptions();
    this.itemId = this.route.snapshot.paramMap.get('id');
    this.sectionYear = this.route.snapshot.paramMap.get('year');
    this.sectionName = this.route.snapshot.paramMap.get('name');

    console.log(this.itemId + " " + this.sectionYear);
    this.history = this.getPersonIdAndUserIdFromCookie();
  }

  /////////////////////////////FORM CONTROLLERS/////////////////////////////


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
      student_rel: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({

      // Repite los campos del primer paso si es necesario
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
      address: ['', Validators.required]
    });
  }

  /////////////////////////////END FORM CONTROLLERS/////////////////////////////


  /////////////////////////////QUERY CONTROLLERS/////////////////////////////

  async loadParentList() {
    this.parent = await this.parent_list_recover();
    this.student = await this.student_list_recover();
    this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod
    // ... cualquier otra lógica que dependa de 'parent'
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
      const response = await fetch("http://localhost/jfb_rest_api/server.php?sorted_section_list=&year=" + event + "&period=" + this.onPeriod['current_period']
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

  /////////////////////////////END QUERY CONTROLLERS/////////////////////////////


  //////////////////OPERATION COTROLLERS///////////////////////////////

  inscribe() {
    const datos = {
      inscribe: "",
      parent: this.firstFormGroup.value,
      student: this.secondFormGroup.value,
      section_id: this.itemId,
      section_year: this.sectionYear,
      period: this.onPeriod['current_period'],
      history: this.history
    };

    if (this.firstFormGroup.valid && this.secondFormGroup.valid) {
      // El formulario tiene valores válidos
      console.log('Formulario de Inscripción', datos);
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
              this.router.navigate(['app/viewSection']);
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

  //////////////////END OPERATION COTROLLERS///////////////////////////////


  //////////////////VALIDATION COTROLLERS///////////////////////////////

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


  selectedNationality = 'V-'; // Valor predeterminado

  nationality = [
    { value: 'V-', label: 'V' },
    { value: 'E-', label: 'E' },
  ];

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

  //////////////////END VALIDATION COTROLLERS///////////////////////////////

  //////////////////STEPPER COTROLLERS///////////////////////////////

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

  //////////////////END STEPPER COTROLLERS///////////////////////////////

  //////////////////ROUTES COTROLLERS///////////////////////////////


  goToSection() {
    this.router.navigate(['app/viewSection']);
  }

  onYearStudentChange(event: any) {
    alert(event);
  }

  //////////////////END ROUTES COTROLLERS///////////////////////////////



  /////////////////////////////TEXT CONTROLLERS/////////////////////////////

  firstLetterUpperCase(word: string): string {
    return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
  }

  /////////////////////////////END TEXT CONTROLLERS/////////////////////////////


  ///////////////////HISTORY CONTROLLERS///////////////////////////

  getPersonIdAndUserIdFromCookie() {
    const person_id = this.cookieService.get('person_id');
    const user = this.cookieService.get('user_id');

    return { person_id, user };
  }

  ///////////////////END HISTORY CONTROLLERS///////////////////////////



}











