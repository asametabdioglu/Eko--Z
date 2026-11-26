import React from 'react';
import { 
  Activity, 
  Sprout, 
  Bug, 
  MapPin, 
  PlusCircle, 
  ArrowRight, 
  Droplets, 
  Thermometer, 
  Sun, 
  CheckCircle2, 
  Compass,
  Cpu,
  Info
} from 'lucide-react';
import { Measurement, Observation, RegionType } from '../../types';
import { SingleMetricChart } from '../charts/EcosystemCharts';
import { NavTab } from '../common/Header';

interface DashboardViewProps {
  measurements: Measurement[];
  observations: Observation[];
  onNavigate: (tab: NavTab) => void;
  onSelectRegionResearch?: (region: RegionType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  measurements,
  observations,
  onNavigate,
  onSelectRegionResearch
}) => {
  const totalMeasurements = measurements.length;
  const plantsCount = observations.filter(o => o.category === 'plant').length;
  const animalsCount = observations.filter(o => o.category === 'animal').length;
  
  // Tracked regions count
  const distinctRegions = new Set([
    ...measurements.map(m => m.region),
    ...observations.map(o => o.region)
  ]);
  const trackedRegionsCount = distinctRegions.size;

  // Recent measurements (last 4)
  const recentMeasurements = [...measurements]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  // Recent observations (last 4)
  const recentObservations = [...observations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // 7-day filtered data for the home charts
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const last7DaysMeasurements = measurements.filter(m => {
    const d = new Date(m.date);
    return !isNaN(d.getTime()) && d >= sevenDaysAgo;
  });
  // Fallback to recent measurements if no records within 7 days
  const chartData = last7DaysMeasurements.length >= 2 
    ? last7DaysMeasurements 
    : measurements.slice(0, 10);

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 text-white shadow-sm border border-emerald-800">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
          <img 
            src="/src/assets/images/hero_ecosystem_recovery_1794464382733.jpg" 
            alt="Ekosistem İyileşme Manzarası"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold tracking-wider uppercase">
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>FIRST LEGO League Challenge · BIOGLOW Sezonu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white font-sans">
              Merhaba, EKOİZ'e hoş geldin!
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Ekosistemlerin iyileşme sürecini birlikte takip ediyoruz. Arduino UNO sensörlerinizden okuduğunuz verileri kaydedin, canlı gözlemlerinizi belgeleyin ve doğanın uyanışına tanıklık edin.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => onNavigate('add-measurement')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-950 font-semibold text-sm hover:bg-emerald-50 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>Yeni Ölçüm Ekle</span>
            </button>
            <button
              onClick={() => onNavigate('research-map')}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-700/80 text-white font-medium text-sm transition-colors"
            >
              <span>Afet Bölgelerini İncele</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4 Primary Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Toplam Ölçüm Sayısı */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Toplam Ölçüm Sayısı</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 tabular-nums">{totalMeasurements}</span>
            <span className="text-xs text-stone-400 font-normal">kayıtlı ölçüm</span>
          </div>
          <p className="mt-2 text-xs text-stone-500">Arduino UNO ve saha ölçümleri</p>
        </div>

        {/* Card 2: Bitki Gözlemi */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Bitki Gözlemi</span>
            <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 tabular-nums">{plantsCount}</span>
            <span className="text-xs text-stone-400 font-normal">gözlenen bitki</span>
          </div>
          <p className="mt-2 text-xs text-stone-500">Fidan, filiz ve yerel türler</p>
        </div>

        {/* Card 3: Hayvan Gözlemi */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Hayvan & Böcek Gözlemi</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Bug className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 tabular-nums">{animalsCount}</span>
            <span className="text-xs text-stone-400 font-normal">canlı kaydı</span>
          </div>
          <p className="mt-2 text-xs text-stone-500">Kuş, böcek, tozlaştırıcı ve memeliler</p>
        </div>

        {/* Card 4: Takip Edilen Alan Sayısı */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">Takip Edilen Alan Sayısı</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900 tabular-nums">{trackedRegionsCount}</span>
            <span className="text-xs text-stone-400 font-normal">aktif bölge</span>
          </div>
          <p className="mt-2 text-xs text-stone-500">Hatay, Maraş, Adıyaman ve Pilot Alan</p>
        </div>
      </section>

      {/* Sensor Graphs Section: Soil Moisture & Temperature (7 Days) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <h3 className="text-base font-semibold text-stone-900">Toprak Nemi Değişimi</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Son ölçümler · Arduino toprak sensörü (%)</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
            >
              Tüm Grafikler <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <SingleMetricChart
            measurements={chartData}
            metricKey="soilMoisture"
            title="Toprak Nemi"
            unit="%"
            lineColor="#059669"
            fillColor="rgba(5, 150, 105, 0.1)"
            yMin={0}
            yMax={100}
          />
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-amber-600" />
                <h3 className="text-base font-semibold text-stone-900">Sıcaklık Değişimi</h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">Son ölçümler · DHT11 / Ortam sensörü (°C)</p>
            </div>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
            >
              Tüm Grafikler <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <SingleMetricChart
            measurements={chartData}
            metricKey="temperature"
            title="Sıcaklık"
            unit="°C"
            lineColor="#D97706"
            fillColor="rgba(217, 119, 6, 0.1)"
            yMin={0}
            yMax={45}
          />
        </div>
      </section>

      {/* Two Column Grid: Recent Measurements & Recent Observations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Measurements */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-700" />
                <h3 className="text-base font-semibold text-stone-900">Son Ölçüm Bilgileri</h3>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
              >
                Tümünü Gör
              </button>
            </div>

            {recentMeasurements.length === 0 ? (
              <div className="text-center py-10 bg-stone-50 rounded-lg border border-dashed border-stone-200 p-6">
                <p className="text-sm text-stone-600 font-medium">Kayıtlı ölçüm bulunmuyor.</p>
                <p className="text-xs text-stone-400 mt-1 mb-4">Arduino UNO sensörünüz ile ilk ölçümünüzü yapın.</p>
                <button
                  onClick={() => onNavigate('add-measurement')}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  İlk Ölçümü Ekle
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentMeasurements.map((m) => (
                  <div 
                    key={m.id}
                    className="p-3.5 rounded-lg border border-stone-100 hover:border-emerald-200 bg-stone-50/50 hover:bg-emerald-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs text-emerald-900">{m.region}</span>
                          <span className="text-stone-300">·</span>
                          <span className="text-xs text-stone-600 font-normal">{m.locationName}</span>
                          {m.isDemo && (
                            <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              DEMO VERİSİ
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {new Date(m.date).toLocaleString('tr-TR')} · {m.studentTeam}
                        </p>
                      </div>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {m.dataSource === 'Arduino UNO ile yapılan pilot ölçüm' ? 'Arduino UNO' : 'Manuel'}
                      </span>
                    </div>

                    <div className="mt-2.5 grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-white p-1.5 rounded border border-stone-200/60">
                        <span className="block text-[10px] text-stone-400">Toprak Nem</span>
                        <span className="font-bold text-emerald-800">%{m.soilMoisture}</span>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-stone-200/60">
                        <span className="block text-[10px] text-stone-400">Sıcaklık</span>
                        <span className="font-bold text-amber-800">{m.temperature}°C</span>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-stone-200/60">
                        <span className="block text-[10px] text-stone-400">Hava Nem</span>
                        <span className="font-bold text-cyan-800">%{m.airHumidity}</span>
                      </div>
                      <div className="bg-white p-1.5 rounded border border-stone-200/60">
                        <span className="block text-[10px] text-stone-400">Işık</span>
                        <span className="font-bold text-stone-700">{m.lightLevel}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={() => onNavigate('add-measurement')}
              className="w-full py-2.5 rounded-lg border border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni Sensör Ölçümü Kaydet</span>
            </button>
          </div>
        </div>

        {/* Recent Observations */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-700" />
                <h3 className="text-base font-semibold text-stone-900">Son Eklenen Canlı Gözlemleri</h3>
              </div>
              <button
                onClick={() => onNavigate('observations')}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium"
              >
                Tümünü Gör
              </button>
            </div>

            {recentObservations.length === 0 ? (
              <div className="text-center py-10 bg-stone-50 rounded-lg border border-dashed border-stone-200 p-6">
                <p className="text-sm text-stone-600 font-medium">Kayıtlı canlı gözlemi bulunmuyor.</p>
                <p className="text-xs text-stone-400 mt-1 mb-4">Alanda gördüğünüz ilk bitki veya böceği kaydedin.</p>
                <button
                  onClick={() => onNavigate('observations')}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
                >
                  İlk Gözlemi Ekle
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentObservations.map((obs) => (
                  <div 
                    key={obs.id}
                    className="p-3.5 rounded-lg border border-stone-100 hover:border-emerald-200 bg-stone-50/50 hover:bg-emerald-50/30 transition-colors flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                      {obs.category === 'plant' ? (
                        <Sprout className="w-5 h-5 text-emerald-700" />
                      ) : (
                        <Bug className="w-5 h-5 text-amber-700" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-semibold text-stone-900 truncate">
                          {obs.name}
                        </h4>
                        <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          {obs.category === 'plant' ? obs.developmentStatus : `${obs.animalCategory} (${obs.observationCount || 1} adet)`}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 italic mt-0.5">
                        {obs.species} · {obs.region}
                      </p>
                      <p className="text-xs text-stone-600 line-clamp-1 mt-1">
                        {obs.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100">
            <button
              onClick={() => onNavigate('observations')}
              className="w-full py-2.5 rounded-lg border border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Yeni Bitki / Canlı Gözlemi Ekle</span>
            </button>
          </div>
        </div>

      </section>

      {/* About Project & System Info */}
      <section className="bg-stone-100/70 rounded-2xl p-6 border border-stone-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-stone-900">
              EKOİZ Sistemi ve FIRST LEGO League BIOGLOW Projesi Hakkında
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              EKOİZ, 6 Şubat 2023 depremlerinden etkilenen Hatay, Kahramanmaraş ve Adıyaman gibi bölgelerde ekosistemlerin yeniden canlanmasını incelemek amacıyla tasarlanmıştır. Öğrencilerimiz, okul bahçelerinde ve pilot fidanlıklarda <strong>Arduino UNO</strong> kartına bağlı nem, sıcaklık ve ışık sensörlerinden okunan değerleri el ile girerek kayıt altına alır.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Öğrenci Dostu Sade Arayüz
              </span>
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                Arduino UNO Manuel Veri Doğrulama
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Deneysel Ekosistem İyileşme Puanı (EİP)
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
