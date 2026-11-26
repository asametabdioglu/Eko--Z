import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Trash2, 
  Eye, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  SunMedium, 
  PlusCircle, 
  AlertTriangle,
  X,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { Measurement, RegionType } from '../../types';
import { SingleMetricChart } from '../charts/EcosystemCharts';

interface MeasurementHistoryViewProps {
  measurements: Measurement[];
  onDeleteMeasurement: (id: string) => void;
  onNavigateToAdd: () => void;
}

type TimeFilter = 'all' | '24h' | '7d' | '30d';

export const MeasurementHistoryView: React.FC<MeasurementHistoryViewProps> = ({
  measurements,
  onDeleteMeasurement,
  onNavigateToAdd
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Apply filters
  const filteredMeasurements = useMemo(() => {
    let result = [...measurements];

    // Filter by Region
    if (regionFilter !== 'all') {
      result = result.filter(m => m.region === regionFilter);
    }

    // Filter by Time
    if (timeFilter !== 'all') {
      const now = new Date().getTime();
      let cutoff = 0;
      if (timeFilter === '24h') cutoff = now - 24 * 60 * 60 * 1000;
      else if (timeFilter === '7d') cutoff = now - 7 * 24 * 60 * 60 * 1000;
      else if (timeFilter === '30d') cutoff = now - 30 * 24 * 60 * 60 * 1000;

      result = result.filter(m => {
        const mTime = new Date(m.date).getTime();
        return !isNaN(mTime) && mTime >= cutoff;
      });
    }

    return result;
  }, [measurements, timeFilter, regionFilter]);

  const handleDelete = (id: string) => {
    onDeleteMeasurement(id);
    setDeleteConfirmId(null);
  };

  const exportCsv = () => {
    if (filteredMeasurements.length === 0) return;
    const headers = ['Tarih', 'Bolge', 'Nokta', 'Toprak Nemi (%)', 'Sicaklik (C)', 'Hava Nemi (%)', 'Isik', 'Veri Kaynagi', 'Ekip', 'Aciklama'];
    const rows = filteredMeasurements.map(m => [
      `"${m.date}"`,
      `"${m.region}"`,
      `"${m.locationName.replace(/"/g, '""')}"`,
      m.soilMoisture,
      m.temperature,
      m.airHumidity,
      m.lightLevel,
      `"${m.dataSource}"`,
      `"${m.studentTeam.replace(/"/g, '""')}"`,
      `"${(m.description || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EKOIZ_Olcumler_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Ölçüm Geçmişi ve Grafikler
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Arduino UNO ve pilot saha sensörlerinden kaydedilmiş tüm değerleri inceleyin, filtreleyin ve karşılaştırın.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCsv}
            disabled={filteredMeasurements.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>CSV İndir</span>
          </button>
          <button
            onClick={onNavigateToAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Ölçüm Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Time filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-stone-500 mr-2 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Zaman:
          </span>
          {[
            { id: 'all', label: 'Tüm Zamanlar' },
            { id: '24h', label: 'Son 24 Saat' },
            { id: '7d', label: 'Son 7 Gün' },
            { id: '30d', label: 'Son 30 Gün' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setTimeFilter(f.id as TimeFilter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                timeFilter === f.id
                  ? 'bg-emerald-800 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Region filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="history-region-filter" className="text-xs font-semibold text-stone-500 whitespace-nowrap">
            Bölge:
          </label>
          <select
            id="history-region-filter"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-800 bg-white outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="all">Tüm Bölgeler</option>
            <option value="Hatay">Hatay</option>
            <option value="Kahramanmaraş">Kahramanmaraş</option>
            <option value="Adıyaman">Adıyaman</option>
            <option value="Okul Pilot Alanı">Okul Pilot Alanı</option>
            <option value="Diğer">Diğer</option>
          </select>
          <span className="text-xs text-stone-400 font-mono">
            ({filteredMeasurements.length} kayıt)
          </span>
        </div>
      </div>

      {/* 4 Separate Charts Section (Chart.js) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-900">
            Zaman İçerisindeki Sensör Değişim Grafikleri
          </h2>
          <span className="text-xs text-stone-500">
            Filtrelenen {filteredMeasurements.length} ölçüm verisiyle çizildi
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Toprak Nemi */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">1. Toprak Nemi Değişim Grafiği</h3>
                <p className="text-[11px] text-stone-500">Optimum biyolojik canlılık aralığı: %30 - %70</p>
              </div>
            </div>
            <SingleMetricChart
              measurements={filteredMeasurements}
              metricKey="soilMoisture"
              title="Toprak Nemi"
              unit="%"
              lineColor="#059669"
              fillColor="rgba(5, 150, 105, 0.12)"
              yMin={0}
              yMax={100}
            />
          </div>

          {/* Chart 2: Sıcaklık */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Thermometer className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">2. Sıcaklık Değişim Grafiği</h3>
                <p className="text-[11px] text-stone-500">Ortam sıcaklığı (°C) · DHT11 / Analog termal sensör</p>
              </div>
            </div>
            <SingleMetricChart
              measurements={filteredMeasurements}
              metricKey="temperature"
              title="Sıcaklık"
              unit="°C"
              lineColor="#D97706"
              fillColor="rgba(217, 119, 6, 0.12)"
              yMin={0}
              yMax={45}
            />
          </div>

          {/* Chart 3: Hava Nemi */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">3. Hava Nemi Değişim Grafiği</h3>
                <p className="text-[11px] text-stone-500">Bağıl nem (%) · Buharlaşma ve terleme dengesi</p>
              </div>
            </div>
            <SingleMetricChart
              measurements={filteredMeasurements}
              metricKey="airHumidity"
              title="Hava Nemi"
              unit="%"
              lineColor="#0284C7"
              fillColor="rgba(2, 132, 199, 0.12)"
              yMin={0}
              yMax={100}
            />
          </div>

          {/* Chart 4: Işık Seviyesi */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-yellow-50 text-yellow-700 flex items-center justify-center">
                <SunMedium className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">4. Işık Seviyesi Değişim Grafiği</h3>
                <p className="text-[11px] text-stone-500">Arduino LDR analog okuma (0-1023) · Güneşlenme süresi</p>
              </div>
            </div>
            <SingleMetricChart
              measurements={filteredMeasurements}
              metricKey="lightLevel"
              title="Işık Seviyesi"
              unit="val"
              lineColor="#CA8A04"
              fillColor="rgba(202, 138, 4, 0.12)"
              yMin={0}
              yMax={1023}
            />
          </div>
        </div>
      </section>

      {/* Measurement Records Table */}
      <section className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900">Kayıtlı Ölçümler Listesi</h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">
            Toplam {filteredMeasurements.length} kayıt listeleniyor
          </span>
        </div>

        {filteredMeasurements.length === 0 ? (
          <div className="p-10 text-center text-stone-500">
            <p className="text-sm font-semibold">Filtre kriterlerine uygun ölçüm bulunamadı.</p>
            <p className="text-xs text-stone-400 mt-1 mb-4">
              Zaman veya bölge filtresini genişletin ya da yeni bir sensör ölçümü ekleyin.
            </p>
            <button
              onClick={onNavigateToAdd}
              className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Yeni Ölçüm Ekle
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Tarih</th>
                  <th className="py-3 px-4">Bölge & Nokta</th>
                  <th className="py-3 px-4">Toprak Nem</th>
                  <th className="py-3 px-4">Sıcaklık</th>
                  <th className="py-3 px-4">Hava Nem</th>
                  <th className="py-3 px-4">Işık</th>
                  <th className="py-3 px-4">Kaynak</th>
                  <th className="py-3 px-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMeasurements.map((m) => (
                  <tr key={m.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-stone-800">
                      {new Date(m.date).toLocaleDateString('tr-TR')}
                      <span className="block text-[10px] text-stone-400 font-normal">
                        {new Date(m.date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-emerald-950">{m.region}</div>
                      <div className="text-[11px] text-stone-500 truncate max-w-[180px]">{m.locationName}</div>
                      {m.isDemo && (
                        <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
                          DEMO
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-800">
                      %{m.soilMoisture}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-800">
                      {m.temperature}°C
                    </td>
                    <td className="py-3 px-4 font-bold text-cyan-800">
                      %{m.airHumidity}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-700">
                      {m.lightLevel}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        {m.dataSource === 'Arduino UNO ile yapılan pilot ölçüm' ? 'Arduino UNO' : 'Manuel'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedMeasurement(m)}
                          className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                          title="Detayları Görüntüle"
                          aria-label="Detayları Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(m.id)}
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Ölçümü Sil"
                          aria-label="Ölçümü Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedMeasurement && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                  Ölçüm Kaydı Detayı
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                  {selectedMeasurement.region} · {selectedMeasurement.locationName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMeasurement(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-4 rounded-xl border border-stone-100">
              <div>
                <span className="text-stone-400 block">Tarih & Saat</span>
                <span className="font-semibold text-stone-800">
                  {new Date(selectedMeasurement.date).toLocaleString('tr-TR')}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Ölçümü Yapan Ekip</span>
                <span className="font-semibold text-stone-800">
                  {selectedMeasurement.studentTeam}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Veri Kaynağı</span>
                <span className="font-semibold text-stone-800">
                  {selectedMeasurement.dataSource}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Kayıt Türü</span>
                <span className="font-semibold text-stone-800">
                  {selectedMeasurement.isDemo ? 'Örnek Demo Verisi' : 'Gerçek Saha Ölçümü'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100">
                <span className="text-[10px] text-emerald-800 block">Toprak Nemi</span>
                <span className="text-base font-bold text-emerald-900">%{selectedMeasurement.soilMoisture}</span>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100">
                <span className="text-[10px] text-amber-800 block">Sıcaklık</span>
                <span className="text-base font-bold text-amber-900">{selectedMeasurement.temperature}°C</span>
              </div>
              <div className="bg-cyan-50 p-2.5 rounded-lg border border-cyan-100">
                <span className="text-[10px] text-cyan-800 block">Hava Nemi</span>
                <span className="text-base font-bold text-cyan-900">%{selectedMeasurement.airHumidity}</span>
              </div>
              <div className="bg-yellow-50 p-2.5 rounded-lg border border-yellow-100">
                <span className="text-[10px] text-yellow-800 block">Işık (0-1023)</span>
                <span className="text-base font-bold text-yellow-900">{selectedMeasurement.lightLevel}</span>
              </div>
            </div>

            {selectedMeasurement.description && (
              <div>
                <span className="text-xs font-semibold text-stone-600 block mb-1">Açıklama & Notlar:</span>
                <p className="text-xs text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                  {selectedMeasurement.description}
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setSelectedMeasurement(null)}
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-stone-900">Ölçümü Silmek İstiyor musunuz?</h3>
              <p className="text-xs text-stone-600">
                Bu sensör ölçümü kaydı sistemden ve grafiklerden kalıcı olarak kaldırılacaktır.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-lg border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
