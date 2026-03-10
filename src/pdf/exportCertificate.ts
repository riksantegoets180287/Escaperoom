import { jsPDF } from 'jspdf';

export function exportCertificate(name: string, className: string) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background color
  doc.setFillColor(244, 244, 244);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Border
  doc.setDrawColor(32, 18, 110);
  doc.setLineWidth(5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
  doc.setLineWidth(1);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Content
  doc.setTextColor(32, 18, 110);
  
  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(40);
  doc.text('CERTIFICAAT', pageWidth / 2, 60, { align: 'center' });
  
  doc.setFontSize(20);
  doc.text('Operation Virusvrij', pageWidth / 2, 75, { align: 'center' });

  // Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.text('Dit certificaat wordt uitgereikt aan:', pageWidth / 2, 100, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.text(name, pageWidth / 2, 120, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.text(`Klas: ${className}`, pageWidth / 2, 135, { align: 'center' });

  doc.setFontSize(14);
  const date = new Date().toLocaleDateString('nl-NL');
  const time = new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  doc.text(`Datum: ${date} om ${time}`, pageWidth / 2, 145, { align: 'center' });

  doc.setFontSize(18);
  doc.text('Heeft de supercomputer succesvol virusvrij gemaakt.', pageWidth / 2, 165, { align: 'center' });
  
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(24);
  doc.text('"Eureka!"', pageWidth / 2, 180, { align: 'center' });

  // Footer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Summa College', 40, pageHeight - 40);
  doc.line(40, pageHeight - 38, 100, pageHeight - 38);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Handtekening Beheerder', 40, pageHeight - 33);

  // Save
  const fileName = `Certificaat_Virusvrij_${name.replace(/\s+/g, '_')}_${className}_${date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}
