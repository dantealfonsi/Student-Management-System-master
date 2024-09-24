import { Component, ViewChild, OnInit} from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ToggleSwitchComponent } from 'src/assets/toggle-switch/toggle-switch.component';

interface TimeBlockGenerator {
  start: string;
  end: string;
}

interface Subject {
  name: string;
}

interface Teacher {
  name: string;
  last_name: string;
}


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
    MatSlideToggleModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ToggleSwitchComponent
  ],
  templateUrl: './work-charge.component.html',
  styleUrl: './work-charge.component.css'
})


export class WorkChargeComponent {

minRange: number;
maxRange: number;

sectionData: any;
sectionRutine: any;
itemId: string;

teacherForm: FormGroup;
teachers: Teacher[] = [];
filteredTeacher: Observable<Teacher[]>;


scheduleForm: FormGroup;


subjectForm: FormGroup;
subjects: Subject[] = [];
filteredSubjects: Observable<Subject[]>;
timeBlocksGenerator: TimeBlockGenerator[] = [];

constructor(private fb: FormBuilder, private route: ActivatedRoute) {
  this.subjectForm = this.fb.group({
    subjectCtrl: new FormControl('', Validators.required)
  });

  this.teacherForm = this.fb.group({
    teacherCtrl: new FormControl('', Validators.required)
  });
}



firstFormGroup: AbstractControl;
secondFormGroup: AbstractControl;

ngOnInit() {
  this.minRange = 0;
  this.maxRange = 7;
  this.itemId = this.route.snapshot.paramMap.get('id');
  // Cargar los datos de la sección usando this.itemId

  
  this.scheduleForm = this.fb.group({
    timeBlocks: this.fb.array([])
  });

  this.loadTimeBlocks(); // Asegúrate de que esta línea esté presente

  this.loadList();

  this.timeBlocksGenerator = this.generateTimeBlocks();
  
}



get timeBlocks(): FormArray {
  return this.scheduleForm.get('timeBlocks') as FormArray;
}

loadTimeBlocks() {
  const blocks = [
    { subject: '', teacher: '', start: '07:00 AM', end: '07:45 AM' },
    { subject: '', teacher: '', start: '07:45 AM', end: '08:30 AM' },
    { subject: '', teacher: '', start: '08:30 AM', end: '09:15 AM' },
    { subject: '', teacher: '', start: '09:15 AM', end: '10:00 AM' },
    { subject: '', teacher: '', start: '10:00 AM', end: '10:45 AM' },
    { subject: '', teacher: '', start: '10:45 AM', end: '11:30 AM' },
    { subject: '', teacher: '', start: '11:30 AM', end: '12:15 PM' },
    { subject: '', teacher: '', start: '12:15 PM', end: '01:00 PM' },
    { subject: '', teacher: '', start: '01:00 PM', end: '01:45 PM' },
    { subject: '', teacher: '', start: '01:45 PM', end: '02:30 PM' },
    { subject: '', teacher: '', start: '02:30 PM', end: '03:15 PM' },
    { subject: '', teacher: '', start: '03:15 PM', end: '04:00 PM' },
    { subject: '', teacher: '', start: '04:00 PM', end: '04:45 PM' },
    { subject: '', teacher: '', start: '04:45 PM', end: '05:30 PM' },
    { subject: '', teacher: '', start: '05:30 PM', end: '06:15 PM' }
  ];

  blocks.forEach(block => {
    this.timeBlocks.push(this.fb.group({
      subject: [block.subject, Validators.required],
      teacher: [block.teacher, Validators.required],
      start: [{ value: block.start, disabled: true }, Validators.required],
      end: [{ value: block.end, disabled: true }, Validators.required]
    }));
  });
}


private toggleState: boolean = true;
onToggleChange() {
  this.toggleState = !this.toggleState;
  if (this.toggleState) {
    this.minRange = 0;
    this.maxRange = 7;
  } else {
    this.minRange = 8;
    this.maxRange = 14;
  }

}






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
    
    this.filteredSubjects = this.subjectForm.get('subjectCtrl')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );


    this.filteredTeacher = this.teacherForm.get('teacherCtrl')!.valueChanges.pipe(
      startWith(''),
      map(teacherValue => this.teacher_filter(teacherValue || ''))
    )

    this.rutine_recover();
    this.this_section_recover();
  } catch (error) {
    console.error('Error al recuperar los datos de la lista:', error);
    // Maneja el error según tus necesidades
  }

  //this.dataSource = new MatTableDataSource(this.sectionList);
  //this.dataSource.paginator = this.paginator;
}




async rutine_recover() {
  try {
    const response = await fetch(
      "http://localhost/jfb_rest_api/server.php?routine_list=&id="+this.itemId,
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



async teacherListRecover(): Promise<Teacher[]> {
  try {
    const response = await fetch("http://localhost/jfb_rest_api/server.php?teacher_list=");
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

private teacher_filter(value: string): Teacher[] {
  const filterValue = value.toLowerCase();
  return this.teachers.filter(teacher => 
    `${teacher.name.toLowerCase()} ${teacher.last_name.toLowerCase()}`.includes(filterValue)
  );
}

validateTeacher(index: number) {
  const inputValue = this.timeBlocks.at(index).get('teacher')!.value.toLowerCase();
  const [inputName, inputLastName] = inputValue.split(' ');

  const isValid = this.teachers.some(teacher => 
    teacher.name.toLowerCase() === inputName && teacher.last_name.toLowerCase() === inputLastName
  );

  if (!isValid) {
    this.timeBlocks.at(index).get('teacher')!.setErrors({ notFound: true });
  }
}



displayOption(option: any): string {
  return option ? option.name + " " + option.last_name : "";
}


//////////////////////////////////////MATERIAS//////////////////////////////////////////////////


async subjectListRecover(): Promise<Subject[]> {
  try {
    const response = await fetch("http://localhost/jfb_rest_api/server.php?subject_list=");
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

private _filter(value: string): Subject[] {
  const filterValue = value.toLowerCase();
  return this.subjects.filter(subject => subject.name.toLowerCase().includes(filterValue));
}

validateSubject(index: number) {
  const inputValue = this.timeBlocks.at(index).get('subject')!.value.toLowerCase();
  const isValid = this.subjects.some(subject => subject.name === inputValue);
  if (!isValid) {
    this.subjectForm.get('subject')!.setErrors({ notFound: true });
  }
}

async this_section_recover() {
  try {
    const response = await fetch(
      "http://localhost/jfb_rest_api/server.php?this_section_list=&id="+this.itemId,
    );
    if (!response.ok) {
      throw new Error("Error en la solicitud: " + response.status);
    }
    const data = await response.json();
    console.log("Datos recibidos:", data);
    this.sectionData = data; // Devuelve los datos
    
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}


//////////////////////////////////////MATERIAS//////////////////////////////////////////////////

generateTimeBlocks(): TimeBlockGenerator[] {
  const blocks: TimeBlockGenerator[] = [];
  let startHour = 7;
  let startMinute = 0;

  while (startHour < 13 || (startHour === 13 && startMinute === 0)) {
    const endHour = startMinute + 45 >= 60 ? startHour + 1 : startHour;
    const endMinute = (startMinute + 45) % 60;

    const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

    blocks.push({ start: startTime, end: endTime });

    startHour = endHour;
    startMinute = endMinute;
  }

  return blocks;
}

firstLetterUpperCase(word: string): string {
  return word.toLowerCase().replace(/\b[a-z]/g, c => c.toUpperCase());
} 



}
