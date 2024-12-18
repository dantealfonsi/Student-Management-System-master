import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, viewChild, ElementRef, Renderer2, ChangeDetectorRef } from "@angular/core";
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
import { CookieService } from "ngx-cookie-service";
import { MatExpansionModule } from '@angular/material/expansion';


interface Year {
  value: string;
  viewValue: string;
}

interface Student {
  id: number;
  name: string;
  last_name: string;
  cedula: string;
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
    MatExpansionModule
    
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
  sectionListMatResponsive: any;

  displayedColumns: string[] = ['year', 'section_name', 'teacher_id', 'quota', 'Acciones'];
  paginatedSectionList = [];

  studentList: any;
  studentListMat: any;
  studentListMatResponsive: any;

  displayedStudentColumns: string[] =   ['cedula', 'name', 'last_name', 'Acciones'];
  paginatedStudentList = [];

  min: number;
  max: number;
  showdialog: boolean = false;
  showeditdialog: boolean = false;
  showStudentListDialog: boolean = false;


  dataSource: any;

  periodList: any;
  selectedPeriod: string;

  selectedYear: string = 'todos'; // Valor por defecto sortedSectionListRecover(year: string) { this.selectedYear = year; console.log('Año seleccionado: ', year); // Implementa la lógica que necesitas aquí }

  ////////////////////////////////////////////

  history: any;


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
    private router: Router,
    private cookieService: CookieService,
    private el: ElementRef, private renderer: Renderer2,
    private cdr: ChangeDetectorRef
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

  @ViewChild('paginatorNormal') paginatorNormal: MatPaginator; @ViewChild('sortNormal') sortNormal: MatSort;
  @ViewChild('paginatorResponsive') paginatorResponsive: MatPaginator; @ViewChild('sortResponsive') sortResponsive: MatSort;

  @ViewChild('studentPaginatorNormal') studentPaginatorNormal: MatPaginator; @ViewChild('studentSortNormal') studentSortNormal: MatSort;
  @ViewChild('studentPaginatorResponsive') studentPaginatorResponsive: MatPaginator; @ViewChild('studentSortResponsive') studentSortResponsive: MatSort;


  ngOnInit() {    
    this.initializeFormGroups();
    this.loadList();    
    this.history = this.getPersonIdAndUserIdFromCookie();   
  }

  downloadPdf() {
    const doc = new jsPDF();

    const img = new Image();
    img.src = '../../assets/img/JFB_LOGO_PURPLE.png';

    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 10, 30, 30);

      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Unidad Educativa José Francisco Bermúdez', 50, 20);

      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('Reportes: Secciones', 50, 30);

      // Ocultar la última columna
      const table = this.el.nativeElement.querySelector('#content');
      const rows = table.querySelectorAll('tr');

      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 0) {
          this.renderer.setStyle(cells[cells.length - 1], 'display', 'none');
        }
      });

      autoTable(doc, {
        html: '#content',
        startY: 50,
        styles: {
          fontSize: 12,
          cellPadding: 3,
          textColor: [0, 0, 0],
          fillColor: [220, 220, 220],
        },
        headStyles: {
          fillColor: '#846CEF',
          textColor: '#FFFFFF'
        },
        didParseCell: (data) => {
          if (data.section === 'body') {
            data.cell.text = data.cell.text.map(t => t.charAt(0).toUpperCase() + t.slice(1));
          }
        },
        didDrawCell: (data) => {
          console.log(data.cell.raw);
        }
      });

      // Mostrar la última columna de nuevo
      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 0) {
          this.renderer.setStyle(cells[cells.length - 1], 'display', '');
        }
      });

      doc.save('reporte_secciones.pdf');
    };
  }


  downloadPdfStudentList() {
    const doc = new jsPDF();
  
    const img = new Image();
    img.src = '../../assets/img/JFB_LOGO_PURPLE.png';
  
    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 10, 30, 30);
  
      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Unidad Educativa José Francisco Bermúdez', 50, 20);
  
      const selectedId = this.currentSectionId;
      const selectedSection = this.sectionList.find(p => p.id === selectedId);
  
      if (selectedSection) {
        const yearSection = `${this.firstLetterUpperCase(selectedSection.year)} Año Sección ${this.firstLetterUpperCase(selectedSection.section_name)}`;
        const period = `Periodo: ${selectedSection.period}`;
  
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text(`Lista de Estudiantes: ${yearSection}`, 50, 30);
        doc.text(period, 50, 40);
      }
  
      // Ocultar la última columna
      const table = this.el.nativeElement.querySelector('#content2');
      const rows = table.querySelectorAll('tr');
  
      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 0) {
          this.renderer.setStyle(cells[cells.length - 1], 'display', 'none');
        }
      });
  
      autoTable(doc, {
        html: '#content2',
        startY: 50,
        styles: {
          fontSize: 12,
          cellPadding: 3,
          textColor: [0, 0, 0],
          fillColor: [220, 220, 220],
        },
        headStyles: {
          fillColor: '#846CEF',
          textColor: '#FFFFFF'
        },
        didParseCell: (data) => {
          if (data.section === 'body') {
            data.cell.text = data.cell.text.map(t => t.charAt(0).toUpperCase() + t.slice(1));
          }
        },
        didDrawCell: (data) => {
          console.log(data.cell.raw);
        }
      });
  
      // Mostrar la última columna de nuevo
      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 0) {
          this.renderer.setStyle(cells[cells.length - 1], 'display', '');
        }
      });
  
      doc.save(`lista_${selectedSection.period}_${selectedSection.year}_${selectedSection.section_name}.pdf`);
    };
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
      section: this.AddSectionFormGroup.value,
      history: this.history
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
      this.periodList = await this.periodRecover();
      this.sectionList = await this.sectionListRecover();    
      this.sectionListMat = new MatTableDataSource<Section>(this.sectionList);
      this.sectionListMat.paginator = this.paginatorNormal;  
      this.sectionListMat.sort = this.sortNormal;


      ////////////////////////RESPONSIVE////////////////////////////
      this.sectionListMatResponsive = new MatTableDataSource<Section>(this.sectionList);
      this.sectionListMatResponsive.paginator = this.paginatorResponsive;
      this.sectionListMatResponsive.sort = this.sortResponsive;
      this.applyPaginator();
       ////////////////////////END RESPONSIVE////////////////////////////

      this.selectedPeriod = this.onPeriod['current_period'];

    } catch (error) {
      console.error('Error al recuperar los datos de la lista:', error);
      // Maneja el error según tus necesidades
    }

    //this.dataSource = new MatTableDataSource(this.sectionList);
    //this.dataSource.paginator = this.paginator;
  }

  goToWorkCharge(itemId: string, periodId:string) {
    this.router.navigate(['app/workCharge', itemId, periodId ]);
  }


  goToRegister(itemId: string, year: string,section_name: string) {
    this.router.navigate(['app/addStudent', itemId, year,section_name]);
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




  async section_studentList(section_id: number): Promise<any[]> {
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

  

  
  async sortedSectionListRecover(year: string) {
    this.selectedYear = year; // Actualiza el año seleccionado aquí
  
    if (year === 'todos') {

      const period = this.selectedPeriod ? this.selectedPeriod : this.onPeriod['current_period'];

      this.sectionList = await this.allSectionListRecover(period);
      this.sectionListMat = new MatTableDataSource<Section>(this.sectionList); // Devuelve los datos
      this.sectionListMat.paginator = this.paginatorNormal;
      this.sectionListMat.sort = this.sortNormal;

      this.sectionListMatResponsive = new MatTableDataSource<Section>(this.sectionList); // Devuelve los datos
      this.sectionListMatResponsive.paginator = this.paginatorResponsive;
      this.sectionListMatResponsive.sort = this.sortResponsive;
      this.applyPaginator();
      console.log('Año seleccionado: ', year); // Verifica que se esté seleccionando correctamente
    } else {
      try {
        const period = this.selectedPeriod ? this.selectedPeriod : this.onPeriod['current_period'];
        const response = await fetch(
          `http://localhost/jfb_rest_api/server.php?sorted_section_list=&year=${year}&period=${period}`
        );
        if (!response.ok) {
          throw new Error("Error en la solicitud: " + response.status);
        }
        const data = await response.json();
        console.log("Datos recibidos:", data);
        this.sectionList = data;
        this.sectionListMat = new MatTableDataSource<Section>(this.sectionList); // Devuelve los datos
        this.sectionListMat.paginator = this.paginatorNormal;
        this.sectionListMat.sort = this.sortNormal;
        
        this.sectionListMatResponsive = new MatTableDataSource<Section>(this.sectionList); // Devuelve los datos
        this.sectionListMatResponsive.paginator = this.paginatorResponsive;
        this.sectionListMatResponsive.sort = this.sortResponsive;
        this.applyPaginator();
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

  async allSectionListRecover(period) {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?section_list=&period="+period  
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



  currentSectionId: number;

  async onStudentList(id: number) {
    try {
      this.currentSectionId = id;
      this.studentList = await this.section_studentList(id);
      this.studentListMat = new MatTableDataSource<Student>(this.studentList);
      this.studentListMat.paginator = this.studentPaginatorNormal;  
      this.studentListMat.sort = this.studentSortNormal;
      this.studentListMat._updateChangeSubscription(); // Asegura que los cambios se reflejen en la tabla
  
      this.studentListMatResponsive = new MatTableDataSource<Student>(this.studentList);
      this.studentListMatResponsive.paginator = this.studentPaginatorResponsive;  
      this.studentListMatResponsive.sort = this.studentSortResponsive;
  
      // Asegúrate de que el paginator está listo antes de aplicar la paginación
      setTimeout(() => {
        this.applyStudentPaginator();
      }, 100);
  
      this.openStudentListDialog();
  
    } catch (error) {
      console.error("Error al obtener la lista de estudiantes:", error);
    }
  }
  

  editSection(){
    const datos = {
      editSection: "",
      section: this.AddSectionFormGroup.value,
      history: this.history
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


  async disableRegistration(id, person_id) {
    const datos = {
      disableRegistration: true,
      registration_id: id,
      person_id: person_id,
      section_id: this.currentSectionId,
      history: this.history
    };
  
    console.log(datos);
  
    Swal.fire({
      title: "¿Estás Seguro De Anular Esta Inscripción?",
      text: "¡Este Estudiante no seguirá apareciendo en esta lista!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Anular"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('http://localhost/jfb_rest_api/server.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(async (data) => {
          if (data.message === 'anulado') {
            Swal.fire({
              title: "¡Completado!",
              text: "La inscripción ha sido anulada.",
              icon: "success"
            });
            this.onStudentList(this.currentSectionId);
          } else {
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al anular la inscripción: " + data.message,
              icon: "error"
            });
            console.error('Server error message:', data.message);
          }
        })
        .catch(error => {
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al comunicarse con el servidor: " + error.message,
            icon: "error"
          });
          console.error('Error:', error);
        });
      }
    });
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
      return 'linear-gradient(45deg, #C2B6F7, transparent)';
    case 'segundo':
      return 'linear-gradient(45deg, #A391F3, transparent)';
    case 'tercero':
      return 'linear-gradient(45deg, #6547EB, transparent)';
    case 'cuarto':
      return 'linear-gradient(45deg, #3716CA, transparent)';
    case 'quinto':
      return 'linear-gradient(45deg, #3C18DC, transparent)';
    default:
      return 'linear-gradient(45deg, #281093, transparent)';
  }
}




//////////////////////MANAGE MULTIPLE PERIODS /////////////////////////



async changePeriod(event) {

  this.selectedPeriod = event; // Obtener el valor del MatSelect

  try {
    const response = await fetch(
      "http://localhost/jfb_rest_api/server.php?section_list=&period="+this.selectedPeriod
    );
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();
    console.log("Datos recibidos:", data);
    this.sectionList = data;
    this.sectionListMat = new MatTableDataSource<Section>(this.sectionList); // Devuelve los datos
    this.sectionListMat.paginator = this.paginatorNormal;
    this.sectionListMat.sort = this.sortNormal;

    this.sectionListMatResponsive = new MatTableDataSource<Section>(this.sectionList); // Devuelve los datos
    this.sectionListMatResponsive.paginator = this.paginatorResponsive;
    this.sectionListMatResponsive.sort = this.sortResponsive;
    this.applyPaginator();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    }



  }




async periodRecover(): Promise<[]> {
  try {
    const response = await fetch("http://localhost/jfb_rest_api/server.php?period_list=");
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();
    console.log("Datos recibidos:", data);
    return data; // Devuelve los datos
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return [];
  }
}


disableOnPeriod(): boolean { 

  return this.selectedPeriod !== this.onPeriod['current_period'];

}


///////////////////HISTORIAL///////////////////////////

getPersonIdAndUserIdFromCookie() { 
  const person_id = this.cookieService.get('person_id'); 
  const user = this.cookieService.get('user_id'); 
  
  return { person_id, user }; 
}

  trackByFn(index: number, item: any) {
   return item.period; // O el identificador único de tu item 
  }


    ////////////////////RESPONSIVE CONTROLLERS//////////////////////////////////////////

    applyPaginator() {
      const pageIndex = this.paginatorResponsive.pageIndex;
      const pageSize = this.paginatorResponsive.pageSize;
      const filteredData = this.sectionListMatResponsive.filteredData;
      const startIndex = pageIndex * pageSize;
      this.paginatedSectionList = filteredData.slice(startIndex, startIndex + pageSize);
      //console.log('Paginated Data:', this.paginatedStudentList);
    }
  
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.sectionListMat.filter = filterValue.trim().toLowerCase();
      this.sectionListMatResponsive.filter = filterValue.trim().toLowerCase();
  
      if (this.sectionListMatResponsive.paginatorResponsive) {
        this.sectionListMatResponsive.paginatorResponsive.firstPage();
      }
  
      this.applyPaginator();
    }

    applyStudentPaginator() {
      const pageIndex = this.studentPaginatorResponsive.pageIndex;
      const pageSize = this.studentPaginatorResponsive.pageSize;
      const filteredData = this.studentListMatResponsive.filteredData;
      const startIndex = pageIndex * pageSize;
      this.paginatedStudentList = filteredData.slice(startIndex, startIndex + pageSize);
      //console.log('Paginated Data:', this.paginatedStudentList);
    }
  
  
    applyStudentFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.studentListMat.filter = filterValue.trim().toLowerCase();
      this.studentListMatResponsive.filter = filterValue.trim().toLowerCase();
  
      if (this.studentListMatResponsive.studentPaginatorResponsive) {
        this.studentListMatResponsive.studentPaginatorResponsive.firstPage();
      }
  
      this.applyStudentPaginator();
    }
  
    /////////////////////////////END RESPONSIVE CONTROLLERS/////////////////////////////


  

}
