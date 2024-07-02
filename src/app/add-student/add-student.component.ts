import { Component, ViewChild, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Student } from '../modal/student';
import { ToastService } from '../services/toastr.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})


export class AddStudentComponent implements OnInit {
  
  selected = 'Tutor Legal';

  @ViewChild('stepper') private stepper: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}
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
      cedula: ['', Validators.required],
      name: ['', Validators.required],
      second_name: [''],
      last_name: ['', Validators.required],
      second_last_name: [''],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      birthday: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      // Repite los campos del primer paso si es necesario
      cedula: ['', Validators.required],
      name: ['', Validators.required],
      second_name: [''],
      last_name: ['', Validators.required],
      second_last_name: [''],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      birthday: ['', Validators.required],
      address: ['', Validators.required]
    });
    
    this.thirdFormGroup = this._formBuilder.group({
      year: ['', Validators.required],
      section: ['', Validators.required]
    });
  }

  async loadParentList() {
    this.parent = await this.parent_list_recover();
    this.student = await this.student_list_recover();
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
      other: this.thirdFormGroup.value      
    };

    console.log("datos estudiante: ",datos);

    if (this.firstFormGroup.valid && this.secondFormGroup.valid  && this.thirdFormGroup.valid) {
      // El formulario tiene valores válidos
      console.log('Formulario válido');
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
    
        console.log(data);

      })
      .catch(error => {
        console.error('Error:', error);
      });

    } else {
      // El formulario no tiene valores válidos
      alert("Error en el llenado de datos");
      console.log('Formulario inválido');
    }    
  }
  
}
