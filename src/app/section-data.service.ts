import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectionDataService {
  private sectionData = new BehaviorSubject<any>(null);
  currentSectionData = this.sectionData.asObservable();

  constructor() { }

  changeSectionData(data: any) {
    this.sectionData.next(data);
  }
}