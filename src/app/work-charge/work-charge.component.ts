import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';
import jsPDF from 'jspdf';
import { PeriodService } from '../period.service';

//////////////////////////////INTERFACES/////////////////////////////////////
interface TimeBlockGenerator {
  start: string;
  end: string;
}
interface Subject {
  id: number;
  name: string;
}
interface Teacher {
  id: number;
  cedula: string;
  name: string;
  last_name: string;
  phone: string;
}

//////////////////////////////END INTERFACES/////////////////////////////////////


ToggleSwitchComponent
@Component({
  selector: 'work-charge',
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
    MatSelect,
    MatSlideToggleModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ToggleSwitchComponent,
  ],
  templateUrl: './work-charge.component.html',
  styleUrl: './work-charge.component.css'
})


export class WorkChargeComponent {

  /////////// DAY VARIABLES//////////////////////

  @ViewChild('day') day: MatSelect;
  initialDay: number = 1; // Valor inicial para "Lunes"

  /////////// END DAY VARIABLES//////////////////////

  /////////// RANGE VARIABLES//////////////////////

  minRange: number;
  maxRange: number;

  /////////// END RANGE VARIABLES//////////////////////


  /////////// DATA VARIABLES//////////////////////

  sectionData: any;
  sectionRutine: any;
  itemId: string;

  uniqueTeacherIds: string[] = [];
  teachers: Teacher[] = [];
  filteredTeacher: Observable<Teacher[]>;
  routines: any

  subjects: Subject[] = [];
  filteredSubjects: Observable<Subject[]>;

  current_classroom: string = this.route.snapshot.paramMap.get('classroom');


  /////////// END DATA VARIABLES//////////////////////

  /////////// FORMS VARIABLES//////////////////////

  scheduleForm: FormGroup;
  teacherForm: FormGroup;
  subjectForm: FormGroup;

  firstFormGroup: AbstractControl;
  secondFormGroup: AbstractControl;

  /////////// END FORMS VARIABLES//////////////////////


  /////////// TIME BLOCK CONTROLLERS//////////////////////

  timeBlocksGenerator: TimeBlockGenerator[] = [];
  onPeriod: any[];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, public periodService: PeriodService,) {
    this.subjectForm = this.fb.group({
      subjectCtrl: new FormControl('', Validators.required)
    });


    this.teacherForm = this.fb.group({
      teacherCtrl: new FormControl('', Validators.required)
    });
  }


  /////////// END TIME BLOCK CONTROLLERS//////////////////////


  ngOnInit() {

    this.minRange = 0;
    this.maxRange = 7;

    this.itemId = this.route.snapshot.paramMap.get('id');
    //Charge section data using this.itemID

    this.scheduleForm = this.fb.group({
      timeBlocks: this.fb.array([])
    });


    this.loadList();

  }


  ///////////////////////////////////START PATCH TIMEBLOCKS/////////////////////////////////////////////////

  get timeBlocks(): FormArray {
    return this.scheduleForm.get('timeBlocks') as FormArray;
  }


  loadTimeBlocks(day: string) {
    const blocks = [
      { subject: '', teacher: '', start: '07:00 am', end: '07:40 am', day: day },
      { subject: '', teacher: '', start: '07:40 am', end: '08:20 am', day: day },
      { subject: '', teacher: '', start: '08:20 am', end: '09:10 am', day: day },
      { subject: '', teacher: '', start: '09:10 am', end: '09:50 am', day: day },
      { subject: '', teacher: '', start: '09:50 am', end: '10:30 am', day: day },
      { subject: '', teacher: '', start: '10:30 am', end: '11:10 am', day: day },
      { subject: '', teacher: '', start: '11:10 am', end: '11:50 pm', day: day },
      { subject: '', teacher: '', start: '11:50 pm', end: '12:30 pm', day: day },
      { subject: '', teacher: '', start: '12:30 pm', end: '01:10 pm', day: day },
      { subject: '', teacher: '', start: '01:10 pm', end: '01:50 pm', day: day },
      { subject: '', teacher: '', start: '01:50 pm', end: '02:30 pm', day: day },
      { subject: '', teacher: '', start: '02:30 pm', end: '03:10 pm', day: day },
      { subject: '', teacher: '', start: '03:10 pm', end: '04:00 pm', day: day },
      { subject: '', teacher: '', start: '04:00 pm', end: '04:40 pm', day: day },
      { subject: '', teacher: '', start: '04:40 pm', end: '05:20 pm', day: day },
      { subject: '', teacher: '', start: '05:20 pm', end: '06:00 pm', day: day }
    ];

    blocks.forEach(block => {
      this.timeBlocks.push(this.fb.group({
        subject: [{ value: block.subject, disabled: this.disableOnPeriod() }, Validators.required],
        teacher: [{ value: block.teacher, disabled: this.disableOnPeriod() }, Validators.required],
        start: [{ value: block.start, disabled: true }, Validators.required],
        end: [{ value: block.end, disabled: true }, Validators.required],
        day: [{ value: block.day, disabled: this.disableOnPeriod() }, Validators.required]
      }));
    });

    this.patchTimeBlocks();

  }

  async patchTimeBlocks() {
    const sectionRutine = await this.rutine_recover();

    sectionRutine.forEach(rutine => {
      //console.log('rutine: ' + JSON.stringify(rutine)); // Usar JSON.stringify para ver el contenido del objeto

      this.timeBlocks.controls.forEach((block, index) => {
        //console.log(typeof block.get('day').value, typeof rutine.day);
        //console.log(' start =' +  block.get('start').value + ' end =' +  block.get('end').value + " dia= " + this.day.value);
        //console.log(' RUTINE start =' +  rutine.start_hour + ' end =' +  rutine.end_hour + " dia= " + rutine.day);

        if (block.get('start').value === rutine.start_hour && block.get('end').value === rutine.end_hour && block.get('day').value === rutine.day) {
          //console.log('Lo que' +  JSON.stringify(rutine));
          this.timeBlocks.at(index).patchValue({
            subject: this.getSubjectNameById(rutine.subject_id),
            teacher: this.getTeacherNameById(rutine.teacher_id)
          });
        }
      });
    });
  }

  getSubjectNameById(subject_id: any) {
    const subject = this.subjects.find(subject => subject.id === subject_id);
    return subject ? subject.name : undefined;
  }

  getTeacherNameById(teacher_id: any) {
    const teacher = this.teachers.find(teacher => teacher.id === teacher_id);
    return teacher ? teacher.name + " " + teacher.last_name : undefined;
  }

  getTeacherPhoneById(teacher_id: any) {
    const teacher = this.teachers.find(teacher => teacher.id === teacher_id);
    return teacher ? teacher.phone : undefined;
  }

  getTeacherCedulaById(teacher_id: any) {
    const teacher = this.teachers.find(teacher => teacher.id === teacher_id);
    return teacher ? teacher.cedula : undefined;
  }


  ///////////////////////////////////END PATCH TIMEBLOCKS/////////////////////////////////////////////////



  ///////////////////////////////////TOGGLE COMPONENT CONTROLLERS/////////////////////////////////////////////////

  private toggleState: boolean = true;
  onToggleChange() {
    this.toggleState = !this.toggleState;
    if (this.toggleState) {
      this.minRange = 0;
      this.maxRange = 7;
    } else {
      this.minRange = 8;
      this.maxRange = 15;
    }

  }

  changeDay(event) {
    const selectedDay = this.day.value; // Obtener el valor del MatSelect
    if (selectedDay) { // Verificar que selectedDay no sea undefined
      this.timeBlocks.clear(); // Limpiar los bloques de tiempo actuales
      this.loadTimeBlocks(selectedDay); // Cargar los nuevos bloques de tiempo con el día seleccionado
    } else {
      console.error('El valor de day es undefined');
    }
  }

  ///////////////////////////////////END TOGGLE COMPONENT CONTROLLERS/////////////////////////////////////////////////

  //////////////////////////////////QUERY CONTROLLERS/////////////////////////////////////////////////

  get subjectCtrl(): FormControl {
    return this.subjectForm.get('subjectCtrl') as FormControl;
  }

  get teacherCtrl(): FormControl {
    return this.teacherForm.get('teacherCtrl') as FormControl;
  }

  async loadList() {
    try {
      const control = this.subjectForm.get('subjectCtrl') as FormControl;
      const teacherControl = this.teacherForm.get('teacherCtrl') as FormControl;
      this.teachers = await this.teacherListRecover();
      this.subjects = await this.subjectListRecover();

      await this.periodService.loadPeriod(); // Espera a que los datos se carguen
      this.onPeriod = this.periodService.period; // Asigna los datos a onPeriod  

      this.sectionRutine = await this.rutine_recover();
      this.loadTimeBlocks('1'); // Asegúrate de que esta línea esté presente
      this.filteredSubjects = this.subjectForm.get('subjectCtrl')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );

      this.filteredTeacher = this.teacherForm.get('teacherCtrl')!.valueChanges.pipe(
        startWith(''),
        map(teacherValue => this.teacher_filter(teacherValue || ''))
      )

      this.this_section_recover();
      this.getUniqueTeacherIds();
      this.checkIntervalsInSectionRutine();

    } catch (error) {
      console.error('Error al recuperar los datos de la lista:', error);
      // Maneja el error según tus necesidades
    }

    //this.dataSource = new MatTableDataSource(this.sectionList);
    //this.dataSource.paginator = this.paginator;
  }

  async rutine_recover(): Promise<any[]> {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?routine_list=&id=" + this.itemId,
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      //console.log("Datos recibidos:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return []; // Devuelve un array vacío en caso de error
    }
  }

  async teacherListRecover(): Promise<Teacher[]> {
    try {
      const response = await fetch("http://localhost/jfb_rest_api/server.php?teacher_list=");
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      //console.log("Datos recibidos:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return [];
    }
  }

  private teacher_filter(value: string): Teacher[] {
    const filterValue = value.toLowerCase();
    return this.teachers.filter(teacher =>
      `${teacher.name.toLowerCase()} ${teacher.last_name.toLowerCase()}`.includes(filterValue)
    );
  }

  async subjectListRecover(): Promise<Subject[]> {
    try {
      const response = await fetch("http://localhost/jfb_rest_api/server.php?subject_list=");
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      //console.log("Datos recibidos:", data);
      return data; // Devuelve los datos
    } catch (error) {
      console.error("Error en la solicitud:", error);
      return [];
    }
  }

  async this_section_recover() {
    try {
      const response = await fetch(
        "http://localhost/jfb_rest_api/server.php?this_section_list=&id=" + this.itemId,
      );
      if (!response.ok) {
        throw new Error("Error en la solicitud: " + response.status);
      }
      const data = await response.json();
      //console.log("Datos recibidos:", data);
      this.sectionData = data; // Devuelve los datos

    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  }

  //////////////////////////////////END QUERY CONTROLLERS/////////////////////////////////////////////////

  //////////////////////////////////VALIDATION CONTROLLERS/////////////////////////////////////////////////

  validateTeacher(index: number) {

    const subjectControl = this.timeBlocks.at(index).get('subject');
    const teacherControl = this.timeBlocks.at(index).get('teacher');

    if (!subjectControl.value || subjectControl.errors) {
      Swal.fire({
        title: '¡Campo vacío o inválido!',
        text: 'Por favor, ingresa una materia válida antes de seleccionar un profesor.',
        icon: 'warning'
      });
      // Vaciar el valor del input teacher
      teacherControl.setValue('');
      // Opcional: Puedes enfocar el campo de subject para que el usuario lo llene
      subjectControl.markAsTouched();
      return;
    }

    const inputValue = this.timeBlocks.at(index).get('teacher')!.value.toLowerCase();
    const [inputName, inputLastName] = inputValue.split(' ');

    const isValid = this.teachers.some(teacher =>
      teacher.name.toLowerCase() === inputName && teacher.last_name.toLowerCase() === inputLastName
    );

    if (!isValid) {
      this.timeBlocks.at(index).get('teacher')!.setErrors({ notFound: true });
    }
  }

  validateSubject(index: number) {
    const inputValue = this.timeBlocks.at(index).get('subject')!.value.toLowerCase();
    const isValid = this.subjects.some(subject => subject.name.toLowerCase() === inputValue);
    if (!isValid) {
      this.timeBlocks.at(index).get('subject')!.setErrors({ notFound: true });
    } else {
      this.timeBlocks.at(index).get('subject')!.setErrors(null); // Limpiar errores si es válido
    }
  }

  private _filter(value: string): Subject[] {
    const filterValue = value.toLowerCase();
    return this.subjects.filter(subject => subject.name.toLowerCase().includes(filterValue));
  }

  displayOption(option: any): string {
    return option ? option.name + " " + option.last_name : "";
  }

  //////////////////////////////////END VALIDATION CONTROLLERS/////////////////////////////////////////////////

  ///////////////////////////////CONTROLLERS/////////////////////////////////////////////////////////////

  addSubjectToRoutine(index: any) {
    const subjectName = this.timeBlocks.at(index).get('subject').value;
  
    this.filteredSubjects.subscribe(subjects => {
      const selectedSubject = subjects.find(subject => subject.name === subjectName);
  
      if (selectedSubject) {
        const subjectId = selectedSubject.id;
  
        const datos = {
          addSubjectToRoutine: "",
          day: this.day.value,
          section: this.route.snapshot.paramMap.get('id'),
          subject: subjectId,
          start: this.timeBlocks.at(index).get('start').value,
          end: this.timeBlocks.at(index).get('end').value,
          period: this.route.snapshot.paramMap.get('period'),
          classroom: this.route.snapshot.paramMap.get('classroom')
        };
        console.log('Datos enviados:', datos); // Agrega este log para verificar los datos enviados
  
        // Llama a validateSubject después de obtener subjectId
        this.validateSubject(index);
  
        if (this.timeBlocks.at(index).get('subject') && !this.timeBlocks.at(index).get('subject')!.errors) {
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
              console.log('Respuesta del servidor:', data); // Agrega este log para verificar la respuesta del backend
              if (data.icon === 'error' && data.message.includes('aula y horario')) {
                Swal.fire({
                  title: 'Salón ocupado',
                  text: 'Este salón está ocupado a esa hora.',
                  icon: 'warning'
                });

                const subjectControl = this.timeBlocks.at(index).get('subject');
                subjectControl.setValue('');


              } else if (data.icon === 'success') {
                Swal.fire({
                  title: 'Materia añadida al horario!',
                  text: 'La hora de esta materia fue añadida con éxito.',
                  icon: 'success'
                });
                this.loadList();
              }
            })
            .catch(error => {
              console.error('Error:', error);
            });
        }
      } else {
        // Maneja el caso donde no se encuentra la materia
        this.timeBlocks.at(index).get('subject').setErrors({ notFound: true });
      }
    });
    this.checkIntervalsInSectionRutine();
  }
  

  addTeacherToRoutine(index: any) {
    const teacherName = this.timeBlocks.at(index).get('teacher').value;

    this.filteredTeacher.subscribe(teachers => {
      const selectedTeacher = teachers.find(teacher => teacher.name + ' ' + teacher.last_name === teacherName);

      const datos = {
        addTeacherToRoutine: "",
        day: this.day.value,
        section: this.route.snapshot.paramMap.get('id'),
        teacher: selectedTeacher.id,
        start: this.timeBlocks.at(index).get('start').value,
        end: this.timeBlocks.at(index).get('end').value,
        period: this.route.snapshot.paramMap.get('period'),
      };

      // Llama a validateSubject después de obtener subjectId
      this.validateTeacher(index);

      if (this.timeBlocks.at(index).get('teacher') && !this.timeBlocks.at(index).get('teacher')!.errors) {
        // El formulario tiene valores válidos
        // Aquí envia los datos al backend

        fetch('http://localhost/jfb_rest_api/server.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
        })
          .then(response => {
            if (!response.ok) {
              return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
          })
          .then(data => {
            //console.log(data);
            Swal.fire({
              title: data['message'],
              text: data['message'],
              icon: data['icon']
            });
            this.loadList();
          })
          .catch(error => {
            console.error('Error:', error);
            Swal.fire({
              title: 'Error',
              text: error.message,
              icon: 'error'
            });
          });

        //console.log(datos);

      } else {
        // Maneja el caso donde no se encuentra la materia
        this.timeBlocks.at(index).get('teacher').setErrors({ notFound: true });
      }
    });
    this.checkIntervalsInSectionRutine()
  }

  ///////////////////////////////END CONTROLLERS/////////////////////////////////////////////////////////////

  ///////////////////////////////INTERVALS CONTROLLERS/////////////////////////////////////////////////////////////

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
    const section = this.sectionRutine.find(s => s.start_hour === interval.start && s.end_hour === interval.end && s.day === day.toString());
    return section ? this.getSubjectNameById(section.subject_id) : '';
  }


  getSubjectForTeacher(teacherId: string): string {
    const section = this.sectionRutine.find(s => s.teacher_id === teacherId);
    return section ? this.getSubjectNameById(section.subject_id) : 'No asignado';
  }

  getUniqueTeacherIds() {
    const teacherIds = this.sectionRutine
      .map(item => item.teacher_id)
      .filter(id => id !== "0"); // Excluir teacher_id "0"
    this.uniqueTeacherIds = Array.from(new Set(teacherIds));
  }

  tableVisibleDay: boolean = false;
  tableVisibleNoon: boolean = false;

  checkIntervalsInSectionRutine() {
    this.tableVisibleNoon = this.intervalsNoon.some(interval =>
      this.sectionRutine.some(section =>
        section.start_hour === interval.start &&
        section.end_hour === interval.end
      )
    );

    this.tableVisibleDay = this.intervals.some(interval =>
      this.sectionRutine.some(section =>
        section.start_hour === interval.start &&
        section.end_hour === interval.end
      )
    );
  }

  ///////////////////////////////END INTERVALS CONTROLLERS/////////////////////////////////////////////////////////////

  ///////////////////////////////PDF CONTROLLERS/////////////////////////////////////////////////////////////

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
        doc.save(`Horario_${this.sectionData.year}_${this.firstLetterUpperCase(this.sectionData.section_name)}.pdf`);
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

  ///////////////////////////////END PDF CONTROLLERS/////////////////////////////////////////////////////////////

  ///////////////////////////////TEXT CONTROLLERS/////////////////////////////////////////////////////////////

  firstLetterUpperCase(word: string): string {
    return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
  }

  capitalizeWords(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  ///////////////////////////////END TEXT CONTROLLERS/////////////////////////////////////////////////////////////

  ///////////////////////////////ROUTE CONTROLLERS/////////////////////////////////////////////////////////////

  goToSection() {
    this.router.navigate(['app/viewSection']);
  }

  ///////////////////////////////END ROUTE CONTROLLERS/////////////////////////////////////////////////////////////

  ///////////////////////////////PERIOD CONTROLLERS/////////////////////////////////////////////////////////////

  disableOnPeriod(): boolean {

    return this.route.snapshot.paramMap.get('period') !== this.onPeriod['current_period'];

  }

  ///////////////////////////////END PERIOD CONTROLLERS/////////////////////////////////////////////////////////////









}
