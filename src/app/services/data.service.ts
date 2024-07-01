import { Injectable } from '@angular/core';
import { Student } from '../modal/student';
import { Mark } from '../modal/mark';

@Injectable({
  providedIn: 'root'
})

export class DataService {

 
  studentsList: Student[] = [];
  markList: Mark[] = [];

  // deleteMARKSS(id:any) {
  //   const batch = this.afs.firestore.batch();
  //   this.markRef.get().forEach(doc => {
  //      batch.delete(doc.("/Students/"+id).collection("/Mark" + id));
  //   });
  //   batch.commit();
  // }
  //add student
  addStudent(student: Student) {


  }

  addMark(mark: Mark, id : any){

  }

  //get all students
  getAllStudents() {

  }

  getAllMarks(id : any) {

  }

  getMarksById(id : any) {

  }

  //get studentView
  getStudentById(id : any) {

  }

  //delete student
  deleteStudent(student: Student) {

  }
  deleteMark(mark: Mark, id: any) {

  }
}
