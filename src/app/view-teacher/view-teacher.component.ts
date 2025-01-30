
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, viewChild, ElementRef, Renderer2 } from "@angular/core";
import { Config } from "datatables.net-dt";
import "datatables.net-buttons-dt";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ValidationErrors,
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
import { Observable, Subject } from "rxjs";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { MatExpansionModule } from "@angular/material/expansion";

/////////////////////////////INTERFACES/////////////////////////////////

interface Teacher {
  cedula: string;
  name: string;
  last_name: string;
  phone: string;
  teacherData: {
    id: string;
    total_work_charge: number;
    qualification: string;
    degree: string;
    second_qualification: string;
    second_degree: string;
    hiring: string;
    dissmisal: string;
  }
}

/////////////////////////////END INTERFACES/////////////////////////////////

@Component({
  selector: 'view-teacher',
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
    MatExpansionModule
  ],
  templateUrl: './view-teacher.component.html',
  styleUrl: './view-teacher.component.css'
})

export class ViewTeacherComponent {

  /////////////////////////////PAGINATION/////////////////////////////////

  @ViewChild('paginatorNormal') paginatorNormal: MatPaginator; @ViewChild('sortNormal') sortNormal: MatSort;
  @ViewChild('paginatorResponsive') paginatorResponsive: MatPaginator; @ViewChild('sortResponsive') sortResponsive: MatSort;

  /////////////////////////////END PAGINATION/////////////////////////////////


  teacher: any;
  teacherById: any;

  /////////////////////////////LIST VARIABLES /////////////////////////////

  teacherList: any;
  teacherListMat: any;
  teacherListMatResponsive: any;
  registrationList: any;
  registrationListMat: any;
  degreeList: any[];
  secondDegreeList: any[];

  displayedColumns: string[] = ['cedula', 'name', 'last_name', 'qualification', 'Acciones'];
  paginatedTeacherList = [];

  /////////////////////////////END LIST VARIABLES/////////////////////////////

  /////////////////////////////FORMGROUPS/////////////////////////////

  editTeacherFormGroup: FormGroup;
  myControl = new FormControl();
  mySecondControl = new FormControl();

  /////////////////////////////END FORMGROUPS/////////////////////////////


  /////////////STORE DEGREES ARRAYS////////////////

  filteredOptions: Observable<string[]>;
  secondFilteredOptions: Observable<string[]>;

  /////////////END STORE DEGREES ARRAYS////////////////

  /////////////////////////////COMMON VARIBALES/////////////////////////////

  public value: string = '';
  teacher_rutine: any;

  showdialog: boolean = false;
  showeditdialog: boolean = false;
  showProfileDialog: boolean = false;

  dataSource: any;
  onPeriod: any[];

  public profileTeacher: any;

  readonly startDate = new Date(2005, 0, 1);

  min: number;
  max: number;

  history: any;

  /////////////////////////////END COMMON VARIBALES/////////////////////////////


  constructor(
    private _formBuilder: FormBuilder,
    public periodService: PeriodService,
    private datePipe: DatePipe,
    private router: Router,
    private cookieService: CookieService,
    private el: ElementRef, private renderer: Renderer2
  ) { }


  ngOnInit() {
    this.initializeFormGroups();
    this.leerArchivoCarreras();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.secondFilteredOptions = this.mySecondControl.valueChanges.pipe(
      startWith(''),
      map(value => this.second_filter(value || '')),
    );


    /////////////////////////////FORM CONTROLLERS/////////////////////////////


    // Sincronizar myControl con el control del formulario//

    this.myControl.valueChanges.subscribe(value => {
      this.editTeacherFormGroup.get('degree').setValue(value, { emitEvent: false });
    });

    this.mySecondControl.valueChanges.subscribe(value => {
      this.editTeacherFormGroup.get('second_degree').setValue(value, { emitEvent: false });
    });

    this.editTeacherFormGroup.get('degree').valueChanges.subscribe(value => {
      this.myControl.setValue(value, { emitEvent: false });
    });

    this.editTeacherFormGroup.get('second_degree').valueChanges.subscribe(value => {
      this.mySecondControl.setValue(value, { emitEvent: false });
    });

    this.loadList();

    this.history = this.getPersonIdAndUserIdFromCookie();
  }

  initializeFormGroups() {
    this.editTeacherFormGroup = this._formBuilder.group({
      nationality: ["", Validators.required],
      id: ['0'],
      cedula: ["", Validators.required],
      name: ["", Validators.required],
      second_name: ["35"],
      last_name: ["", Validators.required],
      second_last_name: ["35"],
      email: ["", Validators.required],
      phone: ["", Validators.required, this.customPatternValidator(/^(\+58)?-?([04]\d{3})?-?(\d{3})-?(\d{4})\b/)],
      gender: ["", Validators.required],
      birthday: ["", Validators.required],
      address: ["", Validators.required],
      total_work_charge: [Validators.required],
      qualification: ["", Validators.required],
      degree: ["", Validators.required],
      second_qualification: [""],
      second_degree: [""],
    });
  }


  /////////////////////////////END FORM CONTROLLERS/////////////////////////////

  /////////////////////////////PDF CONTROLLERS/////////////////////////////

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
      doc.text('Reportes: Profesores del Plantel', 50, 30);

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
          //console.log(data.cell.raw);
        }
      });

      // Mostrar la última columna de nuevo
      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 0) {
          this.renderer.setStyle(cells[cells.length - 1], 'display', '');
        }
      });

      doc.save('reporte_profesores.pdf');
    };
  }
  /////////////////////////////END PDF CONTROLLERS/////////////////////////////

  /////////////////////////////QUERY CONTROLLERS/////////////////////////////

  leerArchivoCarreras() {
    const rutaArchivo = './assets/carreras.txt';

    fetch(rutaArchivo)
      .then(response => response.text())
      .then(data => {
        this.degreeList = data.split('\n');
        this.secondDegreeList = data.split('\n');

        //console.log(this.degreeList);
        //console.log(this.secondDegreeList);

      })
      .catch(error => console.error('Error al leer el archivo:', error));
  }

  async loadList() {
    try {
      await this.periodService.loadPeriod(); // Espera a que los datos se carguen
      this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod  
      this.teacherList = await this.teacherListRecover();
      this.teacherListMat = new MatTableDataSource<Teacher>(this.teacherList);
      this.teacherListMat.paginator = this.paginatorNormal;
      this.teacherListMat.sort = this.sortNormal;

      ////////////////////////RESPONSIVE////////////////////////////
      this.teacherListMatResponsive = new MatTableDataSource<Teacher>(this.teacherList);
      this.teacherListMatResponsive.paginator = this.paginatorResponsive;
      this.teacherListMatResponsive.sort = this.sortResponsive;
      this.applyPaginator();
      ////////////////////////END RESPONSIVE////////////////////////////
    } catch (error) {
      console.error('Error al recuperar los datos de la lista:', error);
      // Maneja el error según tus necesidades
    }

    //this.dataSource = new MatTableDataSource(this.sectionList);
    //this.dataSource.paginator = this.paginator;
  }

  async teacherListRecover() {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?teacher_list"
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

  /////////////////////////////END QUERY CONTROLLERS/////////////////////////////

  /////////////////////////////OPERATION CONTROLLERS/////////////////////////////

  editTeacher() {
    const datos = {
      editTeacher: "",
      teacher: this.editTeacherFormGroup.value,
      history: this.history
    };

    if (this.editTeacherFormGroup.valid) {
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

          //console.log(data);
          Swal.fire({
            title: 'Profesor editado!',
            text: 'Este Profesor ha sido editado con exito.',
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

  dismiss(id: any): void {
    const datos = {
      dismiss: '',
      id: id,
      history: this.history
    };

    //console.log('Datos antes de enviar:', datos);

    Swal.fire({
      title: "¿Estás seguro de despedir a este profesor?",
      text: "¡Este profesor no seguirá apareciendo en la lista!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, despídelo!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Completado!",
          text: "El profesor ha sido despedido.",
          icon: "success"
        });

        fetch('http://localhost/jfb_rest_api/server.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        })
          .then(response => response.json()) // Cambiado a .text() para ver la respuesta completa
          .then(data => {
            //console.log(data);
            this.loadList();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }

  /////////////////////////////END OPERATION CONTROLLERS/////////////////////////////

  /////////////////////////////DIALOG CONTROLLERS/////////////////////////////

  openEditDialog() {
    this.showeditdialog = true;
  }

  openProfileDialog() {
    this.showProfileDialog = true;
  }

  onEditList(id: string) {
    this.openEditDialog();
    const selectedId = id;
    const selectedTeacher = this.teacherList.find(p => p.id === selectedId);
    if (selectedTeacher) {
      this.editTeacherFormGroup.patchValue({
        id: selectedTeacher.id,
        nationality: selectedTeacher.nationality,
        cedula: selectedTeacher.cedula,
        name: selectedTeacher.name,
        second_name: selectedTeacher.second_name,
        last_name: selectedTeacher.last_name,
        second_last_name: selectedTeacher.second_last_name,
        email: selectedTeacher.email,
        phone: selectedTeacher.phone,
        gender: selectedTeacher.gender,
        birthday: selectedTeacher.birthday,
        address: selectedTeacher.address,
        total_work_charge: selectedTeacher.teacherData.total_work_charge,
        qualification: selectedTeacher.teacherData.qualification,
        degree: selectedTeacher.teacherData.degree,
        second_qualification: selectedTeacher.teacherData.second_qualification,
        second_degree: selectedTeacher.teacherData.second_degree,
      });
    }
  }

  async onProfileList(id: string) {
    this.openProfileDialog();
    this.teacher_rutine = await this.rutine_recover(id);
    const selectedId = id;
    this.profileTeacher = this.teacherList.find(p => p.id === selectedId);
    console.log('Esto: ' + JSON.stringify(this.teacher_rutine));
  }

  hideEditDialog() {
    this.showeditdialog = false;
  }

  hideProfileDialog() {
    this.showProfileDialog = false;
  }

  /////////////////////////////END DIALOG CONTROLLERS/////////////////////////////

  /////////////////////////////ROUTE CONTROLLERS/////////////////////////////

  goToAdd() {
    this.router.navigate(['app/addTeacher']);
  }

  /////////////////////////////END ROUTE CONTROLLERS/////////////////////////////

  probar(id: string) {
    const selectedId = id;
    //console.log(selectedId);
  }

  /////////////////////////////TEXT CONTROLLERS/////////////////////////////

  firstLetterUpperCase(word: string): string {
    return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
  }

  capitalizeWords(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }
  /////////////////////////////END TEXT CONTROLLERS/////////////////////////////

  //////////////////VALIDATION CONTROLLERS///////////////////////////////

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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.degreeList.filter(option => option.toLowerCase().includes(filterValue));
  }

  private second_filter(value: string): string[] {
    const secondFilterValue = value.toLowerCase();
    return this.secondDegreeList.filter(option => option.toLowerCase().includes(secondFilterValue));
  }

  displayOption(option: any): string {
    return option;
  }

  //////////////////VALIDATION CONTROLLERS///////////////////////////////

  ////////////////////////////////////HISTORY CONTROLLERS ///////////////////////////////////

  getPersonIdAndUserIdFromCookie() {
    const person_id = this.cookieService.get('person_id');
    const user = this.cookieService.get('user_id');

    return { person_id, user };
  }

  ////////////////////////////////////END HISTORY CONTROLLERS ///////////////////////////////////


  ////////////////////RESPONSIVE CONTROLLERS//////////////////////////////////////////

  applyPaginator() {
    const pageIndex = this.paginatorResponsive.pageIndex;
    const pageSize = this.paginatorResponsive.pageSize;
    const filteredData = this.teacherListMatResponsive.filteredData;
    const startIndex = pageIndex * pageSize;
    this.paginatedTeacherList = filteredData.slice(startIndex, startIndex + pageSize);
    //console.log('Paginated Data:', this.paginatedStudentList);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.teacherListMat.filter = filterValue.trim().toLowerCase();
    this.teacherListMatResponsive.filter = filterValue.trim().toLowerCase();

    if (this.teacherListMatResponsive.paginatorResponsive) {
      this.teacherListMatResponsive.paginatorResponsive.firstPage();
    }

    this.applyPaginator();
  }

  /////////////////////////////END RESPONSIVE CONTROLLERS/////////////////////////////


  /*********************WORK CHARGE PDF IMPLEMENTATION FOR TEACHERS****************************/

  intervals = [
    { start: '07:00 am', end: '07:40 am' },
    { start: '07:40 am', end: '08:20 am' },
    { start: '08:20 am', end: '09:10 am' },
    { start: '09:10 am', end: '09:50 am' },
    { start: '09:50 am', end: '10:30 am' },
    { start: '10:30 am', end: '11:10 am' },
    { start: '11:10 am', end: '11:50 pm' },
    { start: '11:50 pm', end: '12:30 pm' }
  ];
  
  intervalsNoon = [
    { start: '12:30 pm', end: '01:10 pm' },
    { start: '01:10 pm', end: '01:50 pm' },
    { start: '01:50 pm', end: '02:30 pm' },
    { start: '02:30 pm', end: '03:10 pm' },
    { start: '03:10 pm', end: '04:00 pm' },
    { start: '04:00 pm', end: '04:40 pm' },
    { start: '04:40 pm', end: '05:20 pm' },
    { start: '05:20 pm', end: '06:00 pm' }
  ];

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

  getSubjectForIntervalAndDay(interval, day) {
    const section = this.teacher_rutine.find(s => s.start_hour === interval.start && s.end_hour === interval.end && s.day === day.toString());
    return section ? `${section.subject} - ${section.section} ` : '';
  }

  /*getSubjectNameById(subject_id: any){
    const subject = this.subjects.find(subject => subject.id === subject_id);
    return subject ? subject.name : undefined;  
  }*/


  async rutine_recover(itemId) {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?routine_list_teacher=&teacher_id=" + itemId,
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      //console.log("Rutine recibidos:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  @ViewChild('pdfContent') pdfElement: ElementRef;

  generatePDF() {
    // Ocultar el contenido antes de generar el PDF
    const pdfContent = this.pdfElement.nativeElement;
    pdfContent.style.display = 'block';

    const doc = new jsPDF({
      orientation: 'landscape', // Configura la orientación a horizontal
      unit: 'pt', // Unidad de medida en puntos
      format: 'letter' // Formato de la página tipo carta
    });

    const margin = 30;
    const marginY = 0; // 3 cm en puntos (1 cm = 28.35 pt, aproximadamente 72 pt = 2.54 cm)

    doc.html(pdfContent, {
      callback: (doc) => {
        doc.save(`Horario_Profesor.pdf`);
        // Mostrar el contenido después de generar el PDF
        pdfContent.style.display = 'none';
      },
      x: margin,
      y: marginY,
      html2canvas: {
        scale: 0.75, // Ajusta el tamaño del contenido para que quepa en la página
        scrollX: 0,
        scrollY: 0
      },
      margin: [margin, margin, margin, margin] // Márgenes de 3 cm en todos los lados
    });
  }


  /*********************END WORK CHARGE PDF IMPLEMENTATION FOR TEACHERS****************************/

}



