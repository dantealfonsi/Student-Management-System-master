import { Component, ViewChild, OnInit} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

interface TimeBlock {
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

sectionData: any;
sectionRutine: any;
itemId: string;

teacherForm: FormGroup;
teachers: Teacher[] = [];
filteredTeacher: Observable<Teacher[]>;


subjectForm: FormGroup;
subjects: Subject[] = [];
filteredSubjects: Observable<Subject[]>;
timeBlocks: TimeBlock[] = [];

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
  this.itemId = this.route.snapshot.paramMap.get('id');
  // Cargar los datos de la sección usando this.itemId

  this.loadList();

  this.timeBlocks = this.generateTimeBlocks();
  


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

validateTeacher() {
  const inputValue = this.teacherForm.get('teacherCtrl')!.value.toLowerCase();
  const [inputName, inputLastName] = inputValue.split(' ');

  const isValid = this.teachers.some(teacher => 
    teacher.name.toLowerCase() === inputName && teacher.last_name.toLowerCase() === inputLastName
  );

  if (!isValid) {
    this.teacherForm.get('teacherCtrl')!.setErrors({ notFound: true });
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

validateSubject() {
  const inputValue = this.subjectForm.get('subjectCtrl')!.value;
  const isValid = this.subjects.some(subject => subject.name === inputValue);
  if (!isValid) {
    this.subjectForm.get('subjectCtrl')!.setErrors({ notFound: true });
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

generateTimeBlocks(): TimeBlock[] {
  const blocks: TimeBlock[] = [];
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
