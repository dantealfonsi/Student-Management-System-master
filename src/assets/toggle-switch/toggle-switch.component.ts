import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Asegúrate de importar esto


@Component({
  selector: 'toggle-switch',
  standalone: true,
  imports: [ 
    CommonModule ],
  templateUrl: './toggle-switch.component.html',
  styleUrl: './toggle-switch.component.css'
})
export class ToggleSwitchComponent {
  nightColor: string = '';
  dayColor: string = '';

onToggleChange($event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.nightColor = inputElement.checked ? '#6e80ff' : '';
    this.dayColor = inputElement.checked ?'#a8a5b4' : '';
}






}
