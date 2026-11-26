import { jsPDF } from 'jspdf';
import { Measurement, Observation, Microhabitat, RegionType } from '../types';
import { calculateEip } from './eipCalculator';

export interface ReportFilterOptions {
  region: string;
  startDate?: string;
  endDate?: string;
}

export function generateEcosystemPdfReport(
  measurements: Measurement[],
  observations: Observation[],
  microhabitats: Microhabitat[],
  options: ReportFilterOptions
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.getPageWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header banner
  doc.setFillColor(20, 83, 45); // #14532D Koyu Yeşil
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('EKOIZ - Afet Sonrasi Ekosistem Takip Sistemi', margin + 6, y + 9);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('FIRST LEGO League Challenge BIOGLOW Sezonu Proje Raporu', margin + 6, y + 15);
  doc.text(`Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}`, margin + 6, y + 20);

  y += 30;

  // Filter info
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Filtre ve Kapsam Bilgileri:', margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const regionLabel = options.region === 'Tümü' || !options.region ? 'Tum Bolgeler' : options.region;
  doc.text(`Secilen Bolge: ${regionLabel}`, margin, y);
  y += 5;
  const dateRangeLabel = options.startDate && options.endDate 
    ? `${options.startDate} - ${options.endDate}` 
    : 'Tum Zamanlar';
  doc.text(`Tarih Araligi: ${dateRangeLabel}`, margin, y);
  y += 8;

  // Key Statistics Summary Box
  doc.setFillColor(248, 250, 247); // #F8FAF7
  doc.setDrawColor(220, 235, 220);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  const totalMeasurements = measurements.length;
  const plantsCount = observations.filter(o => o.category === 'plant').length;
  const animalsCount = observations.filter(o => o.category === 'animal').length;
  const totalMicrohabitats = microhabitats.length;

  const avgSoil = totalMeasurements > 0 
    ? Math.round(measurements.reduce((s, m) => s + m.soilMoisture, 0) / totalMeasurements) 
    : 0;
  const avgTemp = totalMeasurements > 0 
    ? (measurements.reduce((s, m) => s + m.temperature, 0) / totalMeasurements).toFixed(1) 
    : '0';
  const avgHumidity = totalMeasurements > 0 
    ? Math.round(measurements.reduce((s, m) => s + m.airHumidity, 0) / totalMeasurements) 
    : 0;

  // Stat columns
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Ozet Gostergeler', margin + 4, y + 7);

  doc.setTextColor(50, 50, 50);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const col1 = margin + 4;
  const col2 = margin + 55;
  const col3 = margin + 115;

  doc.text(`- Toplam Sensor Olcumu: ${totalMeasurements} adet`, col1, y + 14);
  doc.text(`- Bitki Gozlemleri: ${plantsCount} adet`, col1, y + 20);
  doc.text(`- Hayvan / Bocek: ${animalsCount} adet`, col1, y + 26);

  doc.text(`- Ort. Toprak Nemi: %${avgSoil}`, col2, y + 14);
  doc.text(`- Ort. Sicaklik: ${avgTemp} C`, col2, y + 20);
  doc.text(`- Ort. Hava Nemi: %${avgHumidity}`, col2, y + 26);

  const eipResult = calculateEip(measurements, observations, microhabitats, options.region);
  doc.text(`- Mikrohabitat Kayit: ${totalMicrohabitats} adet`, col3, y + 14);
  doc.text(`- Deneme EIP Puani: ${eipResult.normalizedScore} / 100`, col3, y + 20);
  doc.text(`- Durum: ${eipResult.statusText}`, col3, y + 26);

  y += 42;

  // Section 1: Regional Measurement Distribution
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Bolgelere Gore Olcum Dagilimi', margin, y);
  y += 6;

  const regions: RegionType[] = ['Hatay', 'Kahramanmaraş', 'Adıyaman', 'Okul Pilot Alanı', 'Diğer'];
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  regions.forEach(r => {
    const rMeas = measurements.filter(m => m.region === r);
    const rCount = rMeas.length;
    const rSoil = rCount > 0 ? Math.round(rMeas.reduce((s, m) => s + m.soilMoisture, 0) / rCount) : '-';
    const rTemp = rCount > 0 ? (rMeas.reduce((s, m) => s + m.temperature, 0) / rCount).toFixed(1) : '-';

    doc.text(`* ${r}: ${rCount} olcum | Ort. Nem: %${rSoil} | Ort. Sicaklik: ${rTemp} C`, margin + 4, y);
    y += 5;
  });

  y += 4;

  // Section 2: Recent Sensor Measurements Table
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Kayitli Sensor Olcumleri (Son Kayitlar)', margin, y);
  y += 6;

  // Table header
  doc.setFillColor(235, 245, 235);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  doc.text('Tarih', margin + 2, y + 5);
  doc.text('Bolge / Nokta', margin + 35, y + 5);
  doc.text('Toprak Nem', margin + 85, y + 5);
  doc.text('Sicaklik', margin + 110, y + 5);
  doc.text('Hava Nem', margin + 130, y + 5);
  doc.text('Isik', margin + 152, y + 5);
  y += 8;

  doc.setFont('helvetica', 'normal');
  const recentMeasurements = measurements.slice(0, 10);
  if (recentMeasurements.length === 0) {
    doc.text('Secilen filtrelerde olcum bulunamadi.', margin + 2, y + 4);
    y += 7;
  } else {
    recentMeasurements.forEach((m, idx) => {
      if (idx % 2 === 1) {
        doc.setFillColor(250, 250, 250);
        doc.rect(margin, y - 1, contentWidth, 6, 'F');
      }
      const dateText = m.date.replace('T', ' ').substring(0, 16);
      const locText = `${m.region} - ${m.locationName}`.substring(0, 26);
      doc.text(dateText, margin + 2, y + 3.5);
      doc.text(locText, margin + 35, y + 3.5);
      doc.text(`%${m.soilMoisture}`, margin + 85, y + 3.5);
      doc.text(`${m.temperature} C`, margin + 110, y + 3.5);
      doc.text(`%${m.airHumidity}`, margin + 130, y + 3.5);
      doc.text(`${m.lightLevel}`, margin + 152, y + 3.5);
      y += 6;
    });
  }

  y += 6;

  // Section 3: Recent Biological Observations
  doc.setTextColor(20, 83, 45);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Biyolojik Canli Gozlemleri Ozeti', margin, y);
  y += 6;

  const recentObs = observations.slice(0, 8);
  if (recentObs.length === 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Secilen filtrelerde canli gozlemi bulunamadi.', margin + 2, y + 4);
    y += 6;
  } else {
    recentObs.forEach(o => {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      const catLabel = o.category === 'plant' ? '[Bitki]' : '[Hayvan]';
      doc.text(`${catLabel} ${o.name} (${o.species}) - ${o.region}`, margin + 4, y);
      doc.setFont('helvetica', 'normal');
      const statusText = o.category === 'plant' 
        ? `Durum: ${o.developmentStatus || 'Bilinmiyor'}` 
        : `Sinif: ${o.animalCategory || 'Diger'} (${o.observationCount || 1} adet)`;
      doc.text(`${statusText} | Tarih: ${o.date} | ${o.description.substring(0, 60)}`, margin + 6, y + 4);
      y += 8;
    });
  }

  // Footer Disclaimer
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, 275, contentWidth, 14, 'F');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7);
  doc.text(
    'Bilimsel Uyari: EIP ve bu rapordaki gostergeler FIRST LEGO League BIOGLOW sezonu ogrenci projesi kapsaminda deneysel olarak derlenmistir.',
    margin + 3,
    279
  );
  doc.text(
    'Tek basina ekosistemin kesin iyilesme kaniti degildir; egitim, farkindalik ve karsilastirmali pilot izleme amaci tasir.',
    margin + 3,
    284
  );

  // Save PDF
  doc.save(`EKOIZ_Ekosistem_Raporu_${new Date().toISOString().substring(0, 10)}.pdf`);
}
