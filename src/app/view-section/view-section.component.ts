import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, viewChild, ElementRef } from "@angular/core";
import { DataTableDirective, DataTablesModule } from "angular-datatables";
import { Config } from "datatables.net-dt";
import "datatables.net-buttons-dt";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatListModule } from "@angular/material/list";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { PeriodService } from "../period.service";
import Swal from "sweetalert2";
import { Subject } from "rxjs";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { Router } from '@angular/router';


interface Year {
  value: string;
  viewValue: string;
}

interface Section {
  year: string;
  section_name: string;
  teacher_id: {
    name: string;
    last_name: string;
  };
  quota: number;
}

export interface PeriodicElement {
  year: string;
  SectionName: string;
  person_id: number;
  quota: number;
}

@Component({
  selector: "app-view-section",
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
    DataTablesModule,
    CommonModule,
    MatTableModule, 
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatButtonModule,
    
  ],
  providers: [PeriodService],
  templateUrl: "./view-section.component.html",
  styleUrl: "./view-section.component.css",
})


export class ViewSectionComponent {
    
  AddSectionFormGroup: FormGroup;
  onPeriod: any[];
  section: any;
  teacher: any[];
  sectionList: any;
  sectionListMat: any;
  min: number;
  max: number;
  showdialog: boolean = false;
  showeditdialog: boolean = false;
  showStudentListDialog: boolean = false;
  student_list: any;
  dataSource: any;

//displayedColumns: string[] = ['id', 'period'];

  year: Year[] = [
    { value: "primero", viewValue: "Primer año" },
    { value: "segundo", viewValue: "Segundo año" },
    { value: "tercero", viewValue: "Tercero año" },
    { value: "cuarto", viewValue: "Cuarto año" },
    { value: "quinto", viewValue: "Quinto año" },
  ];

  constructor(
    private _formBuilder: FormBuilder,
    public periodService: PeriodService,
    private router: Router
  ) {}

  initializeFormGroups() {
    this.AddSectionFormGroup = this._formBuilder.group({
      id: ['0'],
      year: ["", Validators.required],
      SectionName: ["", Validators.required],
      quota: ["35"],
      person_id: ["",Validators.required],
      period: [""]
    });
  }

  @ViewChild(MatPaginator) paginator : MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {    
    this.initializeFormGroups();
    this.loadList();    
  }

  downloadPdf(){
    var doc = new jsPDF();

      autoTable(doc,{html:"#content"});
      doc.save("lista_de_secciones");
  }


  openDialog() {
    this.AddSectionFormGroup.patchValue({
      id: "0",
      year: "",
      SectionName: "",
      quota: "35",
      person_id: "",
      period: ""
    }); 

    this.showdialog = true;
  }

  openEditDialog() {
    this.showeditdialog = true;
  }

  openStudentListDialog() {
    this.showStudentListDialog = true;
  }


  hideDialog() {
    this.showdialog = false;
  }

  hideEditDialog() {
    this.showeditdialog = false;
  }

  hideStudentListDialog(){
    this.showStudentListDialog = false;
  }

  addSection() {

    const datos = {
      addSection: "",
      section: this.AddSectionFormGroup.value
    };

    if (this.AddSectionFormGroup.valid) {
      // El formulario tiene valores válidos
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
        Swal.fire({
          title: 'Seccion añadida!',
          text: 'La sección fue añadida con exito.',
          icon: 'success'
        });
        this.loadList();
        this.hideDialog();
      })
      .catch(error => {
        console.error('Error:', error);
      });

    } else {
      // El formulario no tiene valores válidos
      Swal.fire({
        title: '¡Faltan Datos en este formulario!',
        text: 'No puedes agregar debido a que no has ingesado todos los datos.',
        icon: 'error'
      });    
    }    
  }

  async loadList() {
    try {
      this.teacher = await this.teacher_list_recover();
      await this.periodService.loadPeriod(); // Espera a que los datos se carguen
      this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod  
      this.sectionList = await this.sectionListRecover();    
      this.sectionListMat = new MatTableDataSource<Section>(this.sectionList);
      this.sectionListMat.paginator = this.paginator;  
      this.sectionListMat.sort = this.sort;

    } catch (error) {
      console.error('Error al recuperar los datos de la lista:', error);
      // Maneja el error según tus necesidades
    }

    //this.dataSource = new MatTableDataSource(this.sectionList);
    //this.dataSource.paginator = this.paginator;
  }

  goToWorkCharge(itemId: string) {
    this.router.navigate(['app/workCharge', itemId]);
  }


  goToRegister(itemId: string, year: string,section_name: string) {
    this.router.navigate(['app/addStudent', itemId, year,section_name]);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.sectionListMat.filter = filterValue.trim().toLowerCase();
  }
  

  async loadSection() {
    await this.recoverSectionName(this.AddSectionFormGroup.get("year").value,this.onPeriod['current_period']);

    this.AddSectionFormGroup.patchValue({
        SectionName: this.section.next_section,
        period: this.onPeriod['current_period']      
      });
  }


  
  async teacher_list_recover() {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?teacher_list="
      );
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

  async section_student_list(section_id: number): Promise<any[]> {
    try {
      const response = await fetch(`http://localhost/jfb_rest_api/server.php?section_student_list&id=${section_id}`);
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      console.log("Datos recibidos:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  

  async sortedSectionListRecover(year : string) {

    if(year==='todos'){
      this.sectionList = await this.sectionListRecover();
      this.sectionListMat = new MatTableDataSource<Section>(this.sectionList); // Devuelve los datos
      this.sectionListMat.paginator = this.paginator;  
      this.sectionListMat.sort = this.sort;
    }else{

    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?sorted_section_list=&year="+year+"&period="+this.onPeriod['current_period']  
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      console.log("Datos recibidos:", data);
      this.sectionList = data;
      this.sectionListMat = new MatTableDataSource<Section>(this.sectionList); // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
      }
    }
  }


  async sectionListRecover() {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?section_list=&period="+this.onPeriod['current_period']  
      );
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


  async recoverSectionName(passYear: string, period: string) { 
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?next_section=&year=" +
          passYear + "&period="+ period
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      console.log("Datos recibidos:", data);
      this.section = data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  onEditList(id: string) {
    this.openEditDialog();
    const selectedId = id;
    const selectedParent = this.sectionList.find(p => p.id === selectedId);
    if (selectedParent) {
      this.AddSectionFormGroup.patchValue({
        id: selectedParent.id,
        year: selectedParent.year ,
        SectionName: selectedParent.section_name,
        quota: selectedParent.quota,
        person_id: selectedParent.teacher_id,
        period: selectedParent.period 
      });
    }
  }  


  async onStudentList(id: number) {
    try {
      this.student_list = await this.section_student_list(id);
      this.openStudentListDialog();
    } catch (error) {
      console.error("Error al obtener la lista de estudiantes:", error);
    }
  }

  editSection(){
    const datos = {
      editSection: "",
      section: this.AddSectionFormGroup.value
    };

    if (this.AddSectionFormGroup.valid) {
      // El formulario tiene valores válidos
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
        Swal.fire({
          title: 'Sección Editada con Exito!',
          text: 'Esta sección ha sido editada con exito.',
          icon: 'success'
        });
        this.loadList();
        this.hideEditDialog()

      })
      .catch(error => {
        console.error('Error:', error);
      });

    } else {
      // El formulario no tiene valores válidos
      Swal.fire({
        title: '¡Faltan Datos en este formulario!',
        text: 'No puedes agregar debido a que no has ingesado todos los datos.',
        icon: 'error'
      });    
    }    
  }

firstLetterUpperCase(word: string): string {
  return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
} 

capitalizeWords(str : string) : string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

displayOption = (option: any): string => {
  return option ? this.firstLetterUpperCase(option.name) + " " + this.firstLetterUpperCase(option.last_name) : "";
}

//////COLOR DEL BACKGROUND//////////////////


getBackgroundColor(year: string): string {
  switch (year) {
    case 'primero':
      return 'linear-gradient(45deg, #4b6ef7, transparent)';
    case 'segundo':
      return 'linear-gradient(45deg, #24b198, transparent)';
    case 'tercero':
      return 'linear-gradient(45deg, #bdae3a, transparent)';
    case 'cuarto':
      return 'linear-gradient(45deg, #d96145, transparent)';
    case 'quinto':
      return 'linear-gradient(45deg, #c51f1f, transparent)';
    default:
      return 'linear-gradient(45deg, #4b6ef7, transparent)';
  }
}


}
