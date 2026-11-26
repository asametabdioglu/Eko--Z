import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  MapPin, 
  Activity, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  Sprout, 
  Bug, 
  Printer, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Measurement, Observation, Microhabitat, RegionType } from '../../types';
import { generateEcosystemPdfReport } from '../../utils/reportGenerator';
import { calculateEip } from '../../utils/eipCalculator';

interface ReportViewProps {
  measurements: Measurement[];
  observations: Observation[];
  microhabitats: Microhabitat[];
}

export const ReportView: React.FC<ReportViewProps> = ({
  measurements,
  observations,
  microhabitats
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Tümü');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccessNotice, setPdfSuccessNotice] = useState(false);

  // Filtered data for preview
  const filteredMeasurements = measurements.filter(m => {
    if (selectedRegion !== 'Tümü' && m.region !== selectedRegion) return false;
    if (startDate && new Date(m.date) < new Date(startDate)) return false;
    if (endDate && new Date(m.date) > new Date(endDate + 'T23:59:59')) return false;
    return true;
  });

  const filteredObservations = observations.filter(o => {
    if (selectedRegion !== 'Tümü' && o.region !== selectedRegion) return false;
    if (startDate && new Date(o.date) < new Date(startDate)) return false;
    if (endDate && new Date(o.date) > new Date(endDate + 'T23:59:59')) return false;
    return true;
  });

  const filteredMicrohabitats = microhabitats.filter(h => {
    if (selectedRegion !== 'Tümü' && h.region !== selectedRegion) return false;
    if (startDate && new Date(h.date) < new Date(startDate)) return false;
    if (endDate && new Date(h.date) > new Date(endDate + 'T23:59:59')) return false;
    return true;
  });

  const totalMeas = filteredMeasurements.length;
  const plants = filteredObservations.filter(o => o.category === 'plant');
  const animals = filteredObservations.filter(o => o.category === 'animal');

  const avgSoil = totalMeas > 0
    ? Math.round(filteredMeasurements.reduce((s, m) => s + m.soilMoisture, 0) / totalMeas)
    : 0;
  const avgTemp = totalMeas > 0
    ? (filteredMeasurements.reduce((s, m) => s + m.temperature, 0) / totalMeas).toFixed(1)
    : '0';
  const avgHumidity = totalMeas > 0
    ? Math.round(filteredMeasurements.reduce((s, m) => s + m.airHumidity, 0) / totalMeas)
    : 0;

  const eipResult = calculateEip(
    filteredMeasurements,
    filteredObservations,
    filteredMicrohabitats,
    selectedRegion === 'Tümü' ? undefined : selectedRegion
  );

  const handleGeneratePdf = () => {
    setIsGeneratingPdf(true);
    setPdfSuccessNotice(false);

    try {
      generateEcosystemPdfReport(
        filteredMeasurements,
        filteredObservations,
        filteredMicrohabitats,
        {
          region: selectedRegion,
          startDate: startDate || undefined,
          endDate: endDate || undefined
        }
      );
      setPdfSuccessNotice(true);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const regionsList: RegionType[] = ['Hatay', 'Kahramanmaraş', 'Adıyaman', 'Okul Pilot Alanı', 'Diğer'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Resmi FLL Proje ve Saha Dokümantasyonu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Ekosistem Gelişim Raporu
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-2xl">
            Tüm sensör ölçümlerini ve canlı gözlemlerini bir araya getirerek jüri sunumuna ve bilimsel değerlendirmeye hazır PDF raporu üretin.
          </p>
        </div>

        {/* Big Action Button */}
        <button
          onClick={handleGeneratePdf}
          disabled={isGeneratingPdf}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 hover:to-green-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          <span>{isGeneratingPdf ? 'PDF Hazırlanıyor...' : 'PDF RAPORU OLUŞTUR'}</span>
        </button>
      </div>

      {pdfSuccessNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">
              PDF raporu başarıyla oluşturuldu ve cihazınıza indirildi!
            </span>
          </div>
          <button
            onClick={() => setPdfSuccessNotice(false)}
            className="text-stone-400 hover:text-stone-600 text-sm font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filter Parameters Box */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Rapor Kapsamı ve Filtre Ayarları</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="report-region" className="block text-xs font-semibold text-stone-700 mb-1">
              Bölge Seçimi
            </label>
            <select
              id="report-region"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-800 bg-white outline-none focus:ring-2 focus:ring-emerald-600"
            >
              <option value="Tümü">Tüm Bölgeler (Genel Rapor)</option>
              <option value="Hatay">Hatay</option>
              <option value="Kahramanmaraş">Kahramanmaraş</option>
              <option value="Adıyaman">Adıyaman</option>
              <option value="Okul Pilot Alanı">Okul Pilot Alanı</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>

          <div>
            <label htmlFor="report-start" className="block text-xs font-semibold text-stone-700 mb-1">
              Başlangıç Tarihi
            </label>
            <input
              id="report-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label htmlFor="report-end" className="block text-xs font-semibold text-stone-700 mb-1">
              Bitiş Tarihi
            </label>
            <input
              id="report-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs font-medium text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Live Report Preview Canvas (Paper-like card) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-8 max-w-4xl mx-auto">
        
        {/* Document Header */}
        <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-emerald-950">EKOİZ</span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Resmi Rapor Önizlemesi
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Afet Sonrası Ekosistem Yeniden Canlandırma ve Takip Sistemi · FIRST LEGO League Challenge
            </p>
          </div>
          <div className="text-left sm:text-right text-xs text-stone-500">
            <div><strong>Rapor Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}</div>
            <div><strong>Kapsam:</strong> {selectedRegion} ({startDate && endDate ? `${startDate} / ${endDate}` : 'Tüm Zamanlar'})</div>
          </div>
        </div>

        {/* 1. Summary Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] text-stone-500 block">Sensör Ölçümü</span>
            <span className="text-xl font-bold text-stone-900">{totalMeas}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">kayıtlı veri</span>
          </div>
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] text-stone-500 block">Ort. Toprak Nemi</span>
            <span className="text-xl font-bold text-emerald-800">%{avgSoil}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">optimal: %30-%70</span>
          </div>
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] text-stone-500 block">Ort. Sıcaklık</span>
            <span className="text-xl font-bold text-amber-800">{avgTemp}°C</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">sensör ortalaması</span>
          </div>
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100">
            <span className="text-[11px] text-stone-500 block">Canlı Gözlemi</span>
            <span className="text-xl font-bold text-green-900">{plants.length + animals.length}</span>
            <span className="text-[10px] text-stone-400 block mt-0.5">{plants.length} bitki, {animals.length} hayvan</span>
          </div>
        </div>

        {/* 2. Regional Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>Bölgelere Göre Ölçüm Sayıları ve Ortalamalar</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-2.5 px-3">Bölge</th>
                  <th className="py-2.5 px-3">Ölçüm Sayısı</th>
                  <th className="py-2.5 px-3">Ort. Toprak Nem</th>
                  <th className="py-2.5 px-3">Ort. Sıcaklık</th>
                  <th className="py-2.5 px-3">Ort. Hava Nem</th>
                  <th className="py-2.5 px-3">Canlı Gözlemi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {regionsList.map(r => {
                  const rMeas = measurements.filter(m => m.region === r);
                  const rObs = observations.filter(o => o.region === r);
                  const rSoil = rMeas.length > 0 ? Math.round(rMeas.reduce((s, m) => s + m.soilMoisture, 0) / rMeas.length) : '-';
                  const rTemp = rMeas.length > 0 ? (rMeas.reduce((s, m) => s + m.temperature, 0) / rMeas.length).toFixed(1) : '-';
                  const rHum = rMeas.length > 0 ? Math.round(rMeas.reduce((s, m) => s + m.airHumidity, 0) / rMeas.length) : '-';
                  return (
                    <tr key={r} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3 font-semibold text-emerald-950">{r}</td>
                      <td className="py-2.5 px-3 font-mono">{rMeas.length} adet</td>
                      <td className="py-2.5 px-3 font-mono">{rSoil !== '-' ? `%${rSoil}` : '-'}</td>
                      <td className="py-2.5 px-3 font-mono">{rTemp !== '-' ? `${rTemp}°C` : '-'}</td>
                      <td className="py-2.5 px-3 font-mono">{rHum !== '-' ? `%${rHum}` : '-'}</td>
                      <td className="py-2.5 px-3 font-mono">{rObs.length} adet</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. EİP Experimental Score Summary */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-950">
              Deneysel Ekosistem İyileşme Puanı (EİP)
            </span>
            <span className="text-base font-extrabold text-emerald-900">
              {eipResult.normalizedScore} / 100
            </span>
          </div>
          <p className="text-xs text-emerald-800">
            {eipResult.explanation}
          </p>
        </div>

        {/* Disclaimer footer */}
        <div className="pt-4 border-t border-stone-200 text-stone-400 text-[11px] leading-relaxed">
          Bu rapor EKOİZ projesi kapsamında öğrenciler tarafından toplanan sensör ve gözlem verileriyle otomatik oluşturulmuştur. Jüri değerlendirme ve eğitim amaçlıdır.
        </div>

      </div>
    </div>
  );
};
