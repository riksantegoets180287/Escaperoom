import { jsPDF } from 'jspdf';

export function exportCertificate(name: string, className: string) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(244, 244, 244);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setDrawColor(32, 18, 110);
  doc.setLineWidth(5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  doc.setLineWidth(1);
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

  doc.setFillColor(32, 18, 110);
  doc.rect(25, 25, pageWidth - 50, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(42);
  doc.text('CERTIFICAAT', pageWidth / 2, 45, { align: 'center' });

  doc.setFontSize(18);
  doc.text('Operation Virusvrij - Geslaagd', pageWidth / 2, 58, { align: 'center' });

  doc.setTextColor(32, 18, 110);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text('Dit certificaat wordt uitgereikt aan:', pageWidth / 2, 80, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text(name, pageWidth / 2, 95, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.text(`Klas: ${className}`, pageWidth / 2, 107, { align: 'center' });

  const date = new Date().toLocaleDateString('nl-NL');
  const time = new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Datum: ${date} om ${time}`, pageWidth / 2, 116, { align: 'center' });

  doc.setTextColor(32, 18, 110);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('RESULTATEN', pageWidth / 2, 130, { align: 'center' });

  const games = [
    { name: 'Snel Typen', code: 'E' },
    { name: 'Patroon Herkennen', code: 'U' },
    { name: 'Phishing Filter', code: 'R' },
    { name: 'Informatie Zoeken', code: 'E' },
    { name: 'Woordzoeker', code: 'K' },
    { name: 'Wachtwoord Sterkte', code: 'A' }
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  let yPos = 140;
  const leftCol = 55;
  const rightCol = pageWidth / 2 + 20;

  games.forEach((game, index) => {
    const x = index < 3 ? leftCol : rightCol;
    const y = yPos + (index % 3) * 10;

    doc.setFillColor(25, 225, 150);
    doc.circle(x, y - 2, 2, 'F');

    doc.text(`${game.name}`, x + 5, y);

    doc.setFont('helvetica', 'bold');
    doc.setFillColor(32, 18, 110);
    doc.roundedRect(x + 55, y - 4, 8, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(game.code, x + 59, y + 0.5, { align: 'center' });

    doc.setTextColor(32, 18, 110);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Eindcode: EUREKA', pageWidth / 2, 172, { align: 'center' });

  doc.setFillColor(255, 200, 0);
  doc.rect(pageWidth / 2 - 30, 177, 60, 0.5, 'F');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('Gefeliciteerd met het succesvol voltooien van de missie!', pageWidth / 2, 185, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(32, 18, 110);
  doc.text('Summa College', 40, pageHeight - 35);
  doc.setLineWidth(0.5);
  doc.line(40, pageHeight - 33, 85, pageHeight - 33);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Handtekening Beheerder', 40, pageHeight - 28);

  const fileName = `Certificaat_${name.replace(/\s+/g, '_')}_${className}_${date.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
}
