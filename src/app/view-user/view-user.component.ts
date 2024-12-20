import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, viewChild, ElementRef, Renderer2 } from "@angular/core";
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterModule, RouterLink } from "@angular/router";
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MatExpansionModule } from "@angular/material/expansion";

////////////////////////////INTERFACES/////////////////////////////////

interface User {
  user_id: string;
  username: string;
  password: string;
  isAdmin: string;
  isBlocked: string;
  person_id: {
    name: string;
    Last_name: string;
  }
}

/////////////////////////////END INTERFACES/////////////////////////////////

@Component({
  selector: 'app-view-user',
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
    RouterOutlet,
    RouterModule,
    RouterLink,
    MatExpansionModule
  ],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css'
})
export class ViewUserComponent {

  /////////////PAGINATION CONTROLLERS////////////////

  @ViewChild('paginatorNormal') paginatorNormal: MatPaginator; @ViewChild('sortNormal') sortNormal: MatSort;
  @ViewChild('paginatorResponsive') paginatorResponsive: MatPaginator; @ViewChild('sortResponsive') sortResponsive: MatSort;
  @ViewChild('content', { static: false }) content: ElementRef; // Asegúrate de usar el nombre correcto del selector

  /////////////END PAGINATION CONTROLLERS////////////////


  teacherListMat: any;
  userList: any;
  userListMat: any;
  userListMatResponsive: any;
  displayedColumns: string[] = ['username', 'person_id', 'isAdmin', 'isBlocked', 'Acciones'];
  paginatedUserList = [];


  editUserFormGroup: FormGroup;


  checked: unknown;
  addUsers: string | any[];
  showeditdialog: boolean = false;
  showProfileDialog: boolean = false;
  public profileUser: any;
  history: any;


  constructor(
    private router: Router,
    private _formBuilder: FormBuilder,
    private cookieService: CookieService,
    private el: ElementRef,
    private renderer: Renderer2
  ) { }


  ngOnInit() {
    this.loadList();
    this.initializeFormGroups();
    this.notAdmin();
    this.history = this.getPersonIdAndUserIdFromCookie();

  }

  /////////////FORM CONTROLLERS////////////////

  initializeFormGroups() {
    this.editUserFormGroup = this._formBuilder.group({
      id: ['0'],
      user_name: ["", Validators.required],
      password: [""],
      isAdmin: ["", Validators.required]
    });
  }

  /////////////END FORM CONTROLLERS////////////////



  /////////////PDF CONTROLLERS////////////////

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
      doc.text('Reportes: Usuarios Del Sistema', 50, 30);

      // Ocultar la última columna
      const table = this.el.nativeElement.querySelector('#content');
      const rows = table.querySelectorAll('tr');

      rows.forEach((row: any) => {
        const cells = row.querySelectorAll('th, td');
        if (cells.length > 0) {
          this.renderer.setStyle(cells[cells.length - 1], 'display', 'none');
          this.renderer.setStyle(cells[cells.length - 2], 'display', 'none');
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
          this.renderer.setStyle(cells[cells.length - 2], 'display', '');
        }
      });

      doc.save('reporte_usuarios.pdf');
    };
  }

  /////////////END PDF CONTROLLERS////////////////


  /////////////QUERY CONTROLLERS////////////////

  async userListRecover() {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?user_list"
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

  async loadList() {
    try {

      this.userList = await this.userListRecover();
      this.userListMat = new MatTableDataSource<User>(this.userList);
      this.userListMat.paginator = this.paginatorNormal;
      this.userListMat.sort = this.sortNormal;

      ////////////////////////RESPONSIVE////////////////////////////
      this.userListMatResponsive = new MatTableDataSource<User>(this.userList);
      this.userListMatResponsive.paginator = this.paginatorResponsive;
      this.userListMatResponsive.sort = this.sortResponsive;
      this.applyPaginator();
      ////////////////////////END RESPONSIVE////////////////////////////

    } catch (error) {
      console.error('Error al recuperar los datos de la lista:', error);
      // Maneja el error según tus necesidades
    }
    //this.dataSource = new MatTableDataSource(this.sectionList);
    //this.dataSource.paginator = this.paginator;
  }

  /////////////END QUERY CONTROLLERS////////////////



  ///////////// OPERATION CONTROLLERS////////////

  blockUser(id: any) {
    //si el valor de isBlocked es 1 lo cambia a cero y viceversa

    let valor = '1';
    let elemento: any = this.userList.find((e: any) => e.user_id === id);

    if (elemento.isBlocked === '1') valor = '0';

    //relleno la ata a enviar
    const datos = {
      updateBlock: id,
      tabla: "user",
      campo: "isBlocked",
      valor: valor,
      history: this.history
    };

    fetch('http://localhost/jfb_rest_api/server.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    })
      .then(response => response.json())
      .then(data => {
        //si todo va bien actualizo el array de la lista
        elemento.isBlocked = valor;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


  async editUser() {
    const datos = {
      editUser: "",
      user: this.editUserFormGroup.value,
      history: this.history
    };

    if (this.editUserFormGroup.valid) {
      // El formulario tiene valores válidos
      // Aquí envia los datos al backend
      await fetch('http://localhost/jfb_rest_api/server.php', {
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
            title: 'Usuario editado!',
            text: 'El Usuario fue editado con exito.',
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

  onDropList(id: any) {
    const datos = {
      updateUser: id,
      tabla: "user",
      campo: "isDeleted",
      valor: 1,
      history: this.history
    };

    Swal.fire({
      title: "¿Estás seguro de deshabilitarlo?",
      text: "¡Este usuario no seguirá apareciendo en la lista!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, Deshabilítalo"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Completado!",
          text: "El usuario ha sido deshabilitado.",
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
            //console.log('Response from server:', data); // Agregar este registro
            if (data.message === 'ok') {
              // Si todo va bien, actualizo el array de la lista
              this.loadList();
            } else {
              console.error('Server error message:', data.message);
            }
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }

  /////////////END OPERATION CONTROLLERS////////////

  ////////////DIALOG CONTROLLERS////////////////

  openEditDialog() {
    this.showeditdialog = true;
  }

  openProfileDialog() {
    this.showProfileDialog = true;
  }

  hideEditDialog() {
    this.showeditdialog = false;
  }

  hideProfileDialog() {
    this.showProfileDialog = false;
  }

  onProfileList(id: string) {
    this.openProfileDialog();
    const selectedId = id;
    this.profileUser = this.userList.find(p => p.user_id === selectedId);
    //console.log('this:' + this.profileUser);
  }

  onUserList(id: string) {
    this.openEditDialog();
    const selectedId = id;
    const selectedUser = this.userList.find(p => p.user_id === selectedId);
    if (selectedUser) {
      this.editUserFormGroup.patchValue({
        id: selectedUser.user_id,
        user_name: selectedUser.user_name,
        //password: selectedUser.password,
        isAdmin: parseInt(selectedUser.isAdmin, 10)
      });
    }
    //console.log("aqui es:", this.editUserFormGroup.value)
  }

  ////////////END DIALOG CONTROLLERS////////////////



  //////////////ROUTE CONTROLLERS////////////////

  goToAdd() {
    this.router.navigate(['/app/addUsers']);
  }

  readCookie() {
    return this.cookieService.get('user_id');
  }

  notAdmin() {
    if (this.cookieService.get('isAdmin') === '0') {
      this.router.navigate(['/app/dashboard']);
    }
  }

  //////////////END ROUTE CONTROLLERS////////////////


  ///////////////////HISTORY CONTROLLERS ///////////////////////////

  getPersonIdAndUserIdFromCookie() {
    const person_id = this.cookieService.get('person_id');
    const user = this.cookieService.get('user_id');

    return { person_id, user };
  }

  ///////////////////END HISTORY CONTROLLERS ///////////////////////////



  /////////////////TEXT CONTROLLERS//////////////////////////////


  firstLetterUpperCase(word: string): string {
    return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
  }

  capitalizeWords(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  rol(value: string) {
    if (value === '0') return 'Usuario';
    else return 'Administrador';
  }

  /////////////////END TEXT CONTROLLERS//////////////////////////////


  ////////////////////RESPONSIVE CONTROLLERS//////////////////////////////////////////

  applyPaginator() {
    const pageIndex = this.paginatorResponsive.pageIndex;
    const pageSize = this.paginatorResponsive.pageSize;
    const filteredData = this.userListMatResponsive.filteredData;
    const startIndex = pageIndex * pageSize;
    this.paginatedUserList = filteredData.slice(startIndex, startIndex + pageSize);
    //console.log('Paginated Data:', this.paginatedStudentList);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userListMat.filter = filterValue.trim().toLowerCase();
    this.userListMatResponsive.filter = filterValue.trim().toLowerCase();

    if (this.userListMatResponsive.paginatorResponsive) {
      this.userListMatResponsive.paginatorResponsive.firstPage();
    }

    this.applyPaginator();
  }

  /////////////////////////////END RESPONSIVE CONTROLLERS/////////////////////////////


}




