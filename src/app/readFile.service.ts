import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReadFileService {
    constructor(private http: HttpClient) {}

  leerArchivoTexto(url: string): Observable<string> {
    return this.http.get(url, { responseType: 'text' });
  }
}