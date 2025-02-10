import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, viewChild, ElementRef, Renderer2 } from "@angular/core";
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
import { CommonModule, DatePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { PeriodService } from "../period.service";
import Swal from "sweetalert2";
import { Subject } from "rxjs";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from '@angular/material/radio';
import { CookieService } from "ngx-cookie-service";
import { ChangeDetectorRef } from '@angular/core';
import { MatExpansionModule } from "@angular/material/expansion";


interface subject {
  id: string;
  name: string;
}


@Component({
  selector: 'view-subject',
  templateUrl: './view-subject.component.html',
  styleUrls: ['./view-subject.component.css'],
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
    MatRadioModule,
    MatExpansionModule
  ],
})

export class ViewSubjectComponent {

  addSubjectFormGroup: FormGroup;
  addNestedSubjectFormGroup: FormGroup;
  showdialog: boolean = false;
  showeditdialog: boolean = false;
  showNestedSubjectDialog: boolean = false;

  subjectList: any;
  subjectListMat: any;
  subjectListMatResponsive: any;

  displayedColumns: string[] = ['name', 'Acciones'];
  paginatedSubjectList = [];

  subject: string;

  nestedSubjectList: any;
  nestedSubjectListMat: any;
  nestedSubjectListMatResponsive: any;

  displayedNestedColumns: string[] = ['name', 'Acciones'];
  paginatedNestedSubjectList = [];

  history: any;
  await: any;

  currentDate: Date;
  formattedDate: string;


  constructor(
    private _formBuilder: FormBuilder,
    private cookieService: CookieService,
    private el: ElementRef, private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    private datePipe: DatePipe
  ) { }

  /////////////////////////////PAGINATION/////////////////////////////////

  @ViewChild('paginatorNormal') paginatorNormal: MatPaginator; @ViewChild('sortNormal') sortNormal: MatSort;
  @ViewChild('paginatorResponsive') paginatorResponsive: MatPaginator; @ViewChild('sortResponsive') sortResponsive: MatSort;

  @ViewChild('nestedPaginatorNormal') nestedPaginatorNormal: MatPaginator; @ViewChild('nestedSortNormal') nestedSortNormal: MatSort;
  @ViewChild('nestedPaginatorResponsive') nestedPaginatorResponsive: MatPaginator; @ViewChild('nestedSortResponsive') nestedSortResponsive: MatSort;

  /////////////////////////////END PAGINATION/////////////////////////////////

  ngOnInit() {
    this.initializeFormGroups();
    this.loadList();
    this.history = this.getPersonIdAndUserIdFromCookie();

    this.currentDate = new Date();
    this.formattedDate = this.datePipe.transform(this.currentDate, 'dd/MM/yyyy');
  }

  /////////////////////////////QUERY CONTROLLERS/////////////////////////////////

  async loadList() {
    try {
      this.subjectList = await this.subjectListRecover();
      this.subjectListMat = new MatTableDataSource<subject>(this.subjectList);
      this.subjectListMat.paginator = this.paginatorNormal;
      this.subjectListMat.sort = this.sortNormal;

      ////////////////////////RESPONSIVE////////////////////////////
      this.subjectListMatResponsive = new MatTableDataSource<subject>(this.subjectList);
      this.subjectListMatResponsive.paginator = this.paginatorResponsive;
      this.subjectListMatResponsive.sort = this.sortResponsive;
      this.applyPaginator();
      ////////////////////////END RESPONSIVE////////////////////////////

    } catch (error) {
      console.error('Error al recuperar los datos de la lista:', error);
    }
  }

  async subjectListRecover() {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?subject_list="
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      //console.log("Datos recibidos:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  async nestedSubjectListRecover() {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?nested_subject_list="
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      //console.log("Datos recibidos:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  initializeFormGroups() {
    this.addSubjectFormGroup = this._formBuilder.group({
      id: ['0'],
      name: ["", Validators.required],
      grupo_estable: ['0']
    });

    this.addNestedSubjectFormGroup = this._formBuilder.group({
      id: ['0'],
      name: ["", Validators.required],
      grupo_estable: ['1']
    });
  }

  /////////////////////////////END QUERY CONTROLLERS/////////////////////////////////


  /////////////////////////////OPERATION CONTROLLERS/////////////////////////////////

  addSubject() {
    const datos = {
      addSubject: '',
      subject: this.addSubjectFormGroup.value,
      history: this.history
    };

    if (this.addSubjectFormGroup.valid) {

      fetch('http://localhost/jfb_rest_api/server.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      }).then(response => response.json())
        .then(data => {
          //console.log(data);
          if (data['icon'] === 'success') {
            Swal.fire({
              title: 'Nuevo Mensaje:',
              text: data['message'],
              icon: data['icon']
            });
            this.loadList();
            this.addSubjectFormGroup.patchValue({
              name: ""
            })
            this.hideDialog();
          } else {
            Swal.fire({
              title: 'Nuevo Mensaje:',
              text: data['message'],
              icon: data['icon']
            });
          }
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


  addNestedSubject() {

    const datos = {
      addNestedSubject: '',
      subject: this.addNestedSubjectFormGroup.value,
      history: this.history
    };

    if (this.addNestedSubjectFormGroup.valid) {

      fetch('http://localhost/jfb_rest_api/server.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      }).then(response => response.json())
        .then(data => {
          //console.log(data);
          if (data['icon'] === 'success') {
            Swal.fire({
              title: 'Nuevo Mensaje:',
              text: data['message'],
              icon: data['icon']
            });
            this.onNestedList();
            this.addNestedSubjectFormGroup.patchValue({
              name: ""
            })
            this.hideDialog();
          } else {
            Swal.fire({
              title: 'Nuevo Mensaje:',
              text: data['message'],
              icon: data['icon']
            });
          }
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


  editSubject() {
    const datos = {
      editSubject: '',
      subject: this.addSubjectFormGroup.value,
      history: this.history
    };

    if (this.addSubjectFormGroup.valid) {

      fetch('http://localhost/jfb_rest_api/server.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      }).then(response => response.json())
        .then(data => {
          Swal.fire({
            title: 'Nuevo Mensaje:',
            text: data['message'],
            icon: data['icon']
          });
          this.loadList();
          this.hideEditDialog();
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


  onDropList(id: any) {
    const datos = {
      updateSingleFieldSubject: id,
      tabla: "subject",
      campo: "isDeleted",
      whereCondition: `id = ${id}`,
      valor: 1,
      history: this.history
    };

    Swal.fire({
      title: "¿Estás seguro de deshabilitarlo?",
      text: "¡Esta asignatura no seguirá apareciendo en la lista!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Deshabilítala"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Completado!",
          text: "La lista ha sido deshabilitada.",
          icon: "success"
        });
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
            this.loadList();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }


  onDropNestedList(id: any) {
    const datos = {
      updateSingleFieldSubject: id,
      tabla: "subject",
      campo: "isDeleted",
      whereCondition: `id = ${id}`,
      valor: 1,
      history: this.history
    };

    Swal.fire({
      title: "¿Estás seguro de deshabilitarlo?",
      text: "¡Esta asignatura no seguirá apareciendo en la lista!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Deshabilítala"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Completado!",
          text: "La lista ha sido deshabilitada.",
          icon: "success"
        });
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
            this.onNestedList();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }

  /////////////////////////////END OPERATION CONTROLLERS/////////////////////////////////


  ////////////////////////////PDF CONTROLLERS////////////////////////////////



  downloadPdf() {
    const doc = new jsPDF();

    const img = new Image();
    img.src = '../../assets/img/JFB_LOGO_PURPLE.png';

    img.onload = () => {
      doc.addImage(img, 'PNG', 14, 10, 30, 30);

      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text('Unidad Educativa José Francisco Bermúdez', 50, 20);

      doc.setFontSize(16);
      doc.setTextColor(40, 40, 40);
      doc.text("Fecha: "+this.formattedDate, 50, 30);

      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text('Reportes: Materias', 50, 40);

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

      doc.save('reporte_materias.pdf');
    };
  }

  ////////////////////////////END PDF CONTROLLERS////////////////////////////////


  /////////////////////////////////////////////DIALOG CONTROLLERS/////////////////////////////////////////////////

  onEditList(id: string) {
    this.openEditDialog();
    const selectedId = id;
    const selectedSubject = this.subjectList.find(p => p.id === selectedId);
    if (selectedSubject) {
      this.addSubjectFormGroup.patchValue({
        id: selectedSubject.id,
        name: selectedSubject.name,
        grupo_estable: selectedSubject.grupo_estable,
      });
    }
    //console.log("edit:", selectedSubject);
  }


  async onNestedList() {
    this.nestedSubjectList = await this.nestedSubjectListRecover();
    this.nestedSubjectListMat = new MatTableDataSource<subject>(this.nestedSubjectList);

    if (this.nestedSubjectListMat) {
      this.nestedSubjectListMat.paginator = this.nestedPaginatorNormal;
      this.nestedSubjectListMat.sort = this.nestedSortNormal;
      this.nestedSubjectListMat._updateChangeSubscription(); // Asegura que los cambios se reflejen en la tabla

      this.nestedSubjectListMatResponsive = new MatTableDataSource<subject>(this.nestedSubjectList);
      this.nestedSubjectListMatResponsive.paginator = this.nestedPaginatorResponsive;
      this.nestedSubjectListMatResponsive.sort = this.nestedSortResponsive;

      // Asegúrate de que el paginator está listo antes de aplicar la paginación
      setTimeout(() => {
        this.applyNestedPaginator();
      }, 100);
    }

    this.openNestedSubjectDialog();
  }

  handleNestedListClick() {
    this.onNestedList().then(() => {
      this.onNestedList()
    });
  }


  openDialog() {
    this.showdialog = true;
  }

  openEditDialog() {
    this.showeditdialog = true;
  }

  openNestedSubjectDialog() {
    this.showNestedSubjectDialog = true;
  }

  hideDialog() {
    this.showdialog = false;
  }

  hideEditDialog() {
    this.showeditdialog = false;
  }

  hideNestedSubjectDialog() {
    this.showNestedSubjectDialog = false;
  }


  /////////////////////////////////////////////END DIALOG CONTROLLERS/////////////////////////////////////////////////


  /////////////////////////////////////////////TEXT CONTROLLERS/////////////////////////////////////////////////

  firstLetterUpperCase(word: string): string {
    return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
  }

  capitalizeWords(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  /////////////////////////////////////////////END TEXT CONTROLLERS/////////////////////////////////////////////////




  ////////////////////////////////////USER HISTORY ///////////////////////////////////

  getPersonIdAndUserIdFromCookie() {
    const person_id = this.cookieService.get('person_id');
    const user = this.cookieService.get('user_id');

    return { person_id, user };
  }
  ////////////////////////////////////END USER HISTORY ///////////////////////////////////


  ////////////////////RESPONSIVE CONTROLLERS//////////////////////////////////////////

  applyPaginator() {
    const pageIndex = this.paginatorResponsive.pageIndex;
    const pageSize = this.paginatorResponsive.pageSize;
    const filteredData = this.subjectListMatResponsive.filteredData;
    const startIndex = pageIndex * pageSize;
    this.paginatedSubjectList = filteredData.slice(startIndex, startIndex + pageSize);
    //console.log('Paginated Data:', this.paginatedStudentList);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.subjectListMat.filter = filterValue.trim().toLowerCase();
    this.subjectListMatResponsive.filter = filterValue.trim().toLowerCase();

    if (this.subjectListMatResponsive.paginatorResponsive) {
      this.subjectListMatResponsive.paginatorResponsive.firstPage();
    }

    this.applyPaginator();
  }

  applyNestedPaginator() {
    const pageIndex = this.nestedPaginatorResponsive.pageIndex;
    const pageSize = this.nestedPaginatorResponsive.pageSize;
    const filteredData = this.subjectListMatResponsive.filteredData;
    const startIndex = pageIndex * pageSize;
    this.paginatedNestedSubjectList = filteredData.slice(startIndex, startIndex + pageSize);
    //console.log('Paginated Data:', this.paginatedStudentList);
  }

  applyNestedFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.nestedSubjectListMat.filter = filterValue.trim().toLowerCase();
    this.nestedSubjectListMatResponsive.filter = filterValue.trim().toLowerCase();

    if (this.nestedSubjectListMatResponsive.studentPaginatorResponsive) {
      this.nestedSubjectListMatResponsive.studentPaginatorResponsive.firstPage();
    }

    this.applyNestedPaginator();
  }

  /////////////////////////////END RESPONSIVE CONTROLLERS/////////////////////////////


}


