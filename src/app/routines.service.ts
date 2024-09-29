// src/app/services/pdf-generator.service.ts
import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  async generatePDF(sectionRutinePromise: Promise<any[]>) {
    const sectionRutine = await sectionRutinePromise;
    console.log('Datos de sectionRutine:', sectionRutine); // Verificar que los datos llegan correctamente

    const doc = new jsPDF('l', 'mm', 'a4'); // 'l' para horizontal

    // Añadir imagen y encabezado
    const img = new Image();
    img.src = 'assets/img/logo.png'; // Ruta de la imagen
    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 10, 50, 20);
      doc.setFontSize(18);
      doc.text('Nombre de la Escuela', 70, 20);

      // Añadir tabla
      const startY = 40;
      const cellWidth = 30;
      const cellHeight = 10;
      const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
      const hours = [
        '07:00 Am - 07:45 Am', '07:45 Am - 08:30 Am', '08:30 Am - 09:15 Am',
        '09:15 Am - 10:00 Am', '10:00 Am - 10:45 Am', '10:45 Am - 11:30 Am',
        '11:30 Am - 12:15 Pm', '12:15 Pm - 01:00 Pm'
      ];

      // Dibujar encabezados de la tabla
      doc.setFontSize(10);
      doc.text('Horario', 20, startY); // Mover "Horario" a la derecha
      days.forEach((day, index) => {
        doc.text(day, 20 + (index + 1) * cellWidth, startY);
        doc.rect(20 + (index + 1) * cellWidth, startY - cellHeight, cellWidth, cellHeight); // Añadir líneas a los días
      });

      // Dibujar filas de la tabla
      hours.forEach((hour, hourIndex) => {
        doc.text(hour, 10, startY + (hourIndex + 1) * cellHeight);
        doc.rect(10, startY + (hourIndex + 1) * cellHeight - cellHeight, cellWidth, cellHeight); // Añadir líneas a las horas
        days.forEach((day, dayIndex) => {
          const rutine = sectionRutine.find(r => parseInt(r.day) === dayIndex + 1 && r.start_hour + ' - ' + r.end_hour === hour);
          console.log(sectionRutine);
          if (rutine) {
            doc.text('Subject ' + rutine.subject_id, 20 + (dayIndex + 1) * cellWidth, startY + (hourIndex + 1) * cellHeight);
          }
          // Dibujar líneas de la tabla
          doc.rect(30 + (dayIndex + 1) * cellWidth, startY + (hourIndex + 1) * cellHeight - cellHeight, cellWidth, cellHeight);
        });
      });

      doc.save('Horario.pdf');
    };
  }
}