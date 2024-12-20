import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule, } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'add-parent',
  standalone: true,
  imports: [MatSelectModule,MatFormFieldModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-parent.component.html',
  styleUrl: './add-parent.component.css'
})

export class AddParentComponent {

  selected = 'Tutor Legal';
  firstFormGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}
  sectionOptions: string[];
  parent : any[];

  
  ngOnInit() {
    this.initializeFormGroups();
    this.loadParentList();
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
  }

  async loadParentList() {
    this.parent = await this.parent_list_recover();
    // ... cualquier otra lógica que dependa de 'parent'
  }

  async parent_list_recover() {
    alert();
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



  addParent(){
    alert();
    const datos = {
      addParent: "",
      parent: this.firstFormGroup.value
    };

    if (this.firstFormGroup.valid) {
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






