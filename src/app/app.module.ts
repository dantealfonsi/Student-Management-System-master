import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { StudentListComponent } from './student-list/student-list.component';
import { ActionMarkComponent } from './action-mark/action.mark.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ViewStudentsComponent } from './view-students/view-students.component';
import { AddMarkComponent } from './add-mark/add-mark.component';
import { ShowMarkComponent } from './show-mark/show-mark.component';
import { AddMarkkComponent } from './add-markk/add-markk.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DataTablesModule } from "angular-datatables";
import { DataTableDirective } from 'angular-datatables';
import { PeriodService } from './period.service';
import { DatePipe } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {ToggleSwitchComponent} from '../assets/toggle-switch/toggle-switch.component';
import {provideCharts,withDefaultRegisterables,} from 'ng2-charts';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        DashboardComponent,
        ForgotPasswordComponent,
        AddStudentComponent,
        StudentListComponent,
        ActionMarkComponent,
        ConfirmDialogComponent,
        AddMarkComponent,
        ShowMarkComponent,
        AddMarkkComponent,
        
    ],
    providers: [ 
        { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
        PeriodService, DatePipe
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        NgbModule,
        MatIconModule,
        MatStepperModule,
        MatOptionModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatListModule,
        MatSidenavModule,
        SidenavComponent,
        RouterModule,
        MatNativeDateModule,
        MatDatepickerModule,
        DataTablesModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        
    ]
})
export class AppModule { }