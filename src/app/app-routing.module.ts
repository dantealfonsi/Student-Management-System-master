import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { StudentListComponent } from './student-list/student-list.component';
import { ActionMarkComponent } from './action-mark/action.mark.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ViewStudentsComponent } from './view-students/view-students.component';
import { ShowMarkComponent } from './show-mark/show-mark.component';
import { AddMarkComponent } from './add-mark/add-mark.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddParentComponent } from './add-parent/add-parent.component';
import { PeriodComponent } from './period/period.component';
import { ViewSectionComponent } from './view-section/view-section.component'; 

const routes: Routes = [
  {path: '', redirectTo: 'login',pathMatch:'full'},
  {path: 'login',           component: LoginComponent},
  {path: 'register',        component: RegisterComponent},
  {path: 'forgotPassword',  component: ForgotPasswordComponent},
  {path: 'app',     component: SidenavComponent, 
    children: [
      {path: 'addStudent',      component: AddStudentComponent},
      {path: 'dialog',          component: ConfirmDialogComponent},
      {path: 'studentList',     component: StudentListComponent},
      {path: 'viewStudent',     component: ViewStudentsComponent},
      {path: 'actionMark',      component: ActionMarkComponent},
      {path: 'addParent',       component: AddParentComponent},
      {path: 'showMark',        component: ShowMarkComponent},
      {path: 'showMark/:id',    component: ShowMarkComponent},
      {path: 'addMark',         component: AddMarkComponent},
      {path: 'addMark/:id',     component: AddMarkComponent},
      {path: 'dashboard',       component: DashboardComponent},
      {path: 'period',          component: PeriodComponent},
      {path: 'viewSection',     component: ViewSectionComponent},
    ],
  },
  
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
