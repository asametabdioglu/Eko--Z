import React, { useState } from 'react';
import { 
  Award, 
  Sprout, 
  Bug, 
  Droplets, 
  Layers, 
  AlertTriangle, 
  HelpCircle, 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Filter,
  Info,
  X
} from 'lucide-react';
import { 
  Measurement, 
  Observation, 
  Microhabitat, 
  RegionType 
} from '../../types';
import { calculateEip } from '../../utils/eipCalculator';

interface EipViewProps {
  measurements: Measurement[];
  observations: Observation[];
  microhabitats: Microhabitat[];
  onAddMicrohabitat: (habitat: Omit<Microhabitat, 'id' | 'createdAt'>) => void;
  onDeleteMicrohabitat: (id: string) => void;
}

export const EipView: React.FC<EipViewProps> = ({
  measurements,
  observations,
  microhabitats,
  onAddMicrohabitat,
  onDeleteMicrohabitat
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('Tümü');
  const [modalOpen, setModalOpen] = useState(false);
  const [habitatType, setHabitatType] = useState('Nemli Çürümüş Kütük Barınağı');
  const [region, setRegion] = useState<RegionType>('Okul Pilot Alanı');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [description, setDescription] = useState('');
  const [photoURL, setPhotoURL] = useState('');

  const eipResult = calculateEip(
    measurements,
    observations,
    microhabitats,
    selectedRegion === 'Tümü' ? undefined : selectedRegion
  );

  const microhabitatPresetTypes = [
    'Nemli Çürümüş Kütük Barınağı',
    'Karstik Taş Altı Mikro-Ekosistemi',
    'Çalı Altı Malç ve Yaprak Tabakası',
    'Toprak Yuvası / Tozlaşma Taşı',
    'Geçici Yağmur Suyu Birikintisi',
    'Diğer Mikrohabitat'
  ];

  const handleSaveMicrohabitat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Lütfen mikrohabitat hakkında kısa bir açıklama yazın.');
      return;
    }

    onAddMicrohabitat({
      region,
      habitatType,
      date,
      description: description.trim(),
      photoURL: photoURL.trim() || undefined
    });

    setModalOpen(false);
    setDescription('');
    setPhotoURL('');
  };

  const filteredHabitats = microhabitats.filter(h => 
    selectedRegion === 'Tümü' ? true : h.region === selectedRegion
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-1">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Deneysel Biyoçeşitlilik & Ekosistem Göstergesi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Ekosistem İyileşme Puanı (EİP)
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          Öğrencilerin çevresel sensör verilerini, bitki gelişimlerini, hayvan gözlemlerini ve mikrohabitatları bütüncül bir yaklaşımla değerlendirmesini sağlayan deneysel bir puanlama modelidir.
        </p>
      </div>

      {/* Mandatory Scientific Disclaimer Banner */}
      <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-6 h-6 text-amber-800" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-950">Önemli Bilimsel ve Metodolojik Uyarı</h3>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
            "EİP, EKOİZ projesi kapsamında geliştirilen deneysel bir takip göstergesidir. Bilimsel olarak doğrulanmış bir biyolojik çeşitlilik veya ekosistem sağlığı ölçütü değildir. Tek başına ekosistemin iyileştiğini kanıtlamaz."
          </p>
        </div>
      </div>

      {/* Filter by Region */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-500" />
          <span className="text-xs font-semibold text-stone-700">Puanlama Bölgesi:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-medium text-stone-800 bg-white outline-none focus:ring-2 focus:ring-emerald-600"
          >
            <option value="Tümü">Tüm Alanların Genel Ortalaması</option>
            <option value="Hatay">Hatay</option>
            <option value="Kahramanmaraş">Kahramanmaraş</option>
            <option value="Adıyaman">Adıyaman</option>
            <option value="Okul Pilot Alanı">Okul Pilot Alanı</option>
            <option value="Diğer">Diğer</option>
          </select>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Mikrohabitat Ekle</span>
        </button>
      </div>

      {/* Primary Score Dial & Status Card */}
      <div className="bg-gradient-to-br from-white to-stone-50 rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Big Score Display */}
          <div className="flex items-center gap-6">
            <div className="relative w-36 h-36 rounded-full bg-emerald-50 border-8 border-emerald-600/30 flex flex-col items-center justify-center shrink-0 shadow-inner">
              <span className="text-4xl font-black text-emerald-950 tabular-nums">
                {eipResult.normalizedScore}
              </span>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                / 100 EİP
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
                Hesaplanan Durum
              </span>
              <h2 className={`text-xl sm:text-2xl font-extrabold ${eipResult.statusColor}`}>
                {eipResult.statusText}
              </h2>
              <p className="text-xs text-stone-600 max-w-md leading-relaxed mt-1">
                {eipResult.explanation}
              </p>
            </div>
          </div>

          {/* Missing Component Notice if applicable */}
          {!eipResult.isComplete && (
            <div className="w-full md:w-auto p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-950 text-xs space-y-1 max-w-sm">
              <div className="font-bold flex items-center gap-1 text-orange-900">
                <Info className="w-4 h-4 text-orange-600" />
                <span>Eksik Veri Bildirimi</span>
              </div>
              <p className="text-orange-900/90 leading-relaxed">
                Şu bileşenlerin verisi henüz girilmedi: <strong>{eipResult.missingComponents.join(', ')}</strong>. 
                Puan yapay olarak sıfır kabul edilmemiş, yalnızca eldeki %{eipResult.effectiveWeight} veri üzerinden orantılanmıştır.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* 4 Scoring Components Breakdown */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-stone-900">
          EİP Bileşenleri ve Ağırlık Dağılımı
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Bitki Gözlemleri (%30) */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Bitki Gözlemleri</h4>
                  <span className="text-[11px] text-stone-400">Ağırlık: %30</span>
                </div>
              </div>
              <span className={`text-base font-bold ${eipResult.components.plants.hasData ? 'text-emerald-800' : 'text-stone-400'}`}>
                {eipResult.components.plants.hasData ? `${eipResult.components.plants.score} / 100` : 'Veri Yok'}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${eipResult.components.plants.score}%` }}
              />
            </div>

            <p className="text-xs text-stone-600">
              {eipResult.components.plants.details}
            </p>
          </div>

          {/* 2. Hayvan Gözlemleri (%30) */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Bug className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Hayvan & Böcek Gözlemleri</h4>
                  <span className="text-[11px] text-stone-400">Ağırlık: %30</span>
                </div>
              </div>
              <span className={`text-base font-bold ${eipResult.components.animals.hasData ? 'text-amber-800' : 'text-stone-400'}`}>
                {eipResult.components.animals.hasData ? `${eipResult.components.animals.score} / 100` : 'Veri Yok'}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div 
                className="h-full bg-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${eipResult.components.animals.score}%` }}
              />
            </div>

            <p className="text-xs text-stone-600">
              {eipResult.components.animals.details}
            </p>
          </div>

          {/* 3. Toprak ve Çevresel Koşullar (%20) */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Toprak & Çevresel Koşullar</h4>
                  <span className="text-[11px] text-stone-400">Ağırlık: %20 · Arduino UNO</span>
                </div>
              </div>
              <span className={`text-base font-bold ${eipResult.components.environment.hasData ? 'text-cyan-800' : 'text-stone-400'}`}>
                {eipResult.components.environment.hasData ? `${eipResult.components.environment.score} / 100` : 'Veri Yok'}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div 
                className="h-full bg-cyan-600 rounded-full transition-all duration-500"
                style={{ width: `${eipResult.components.environment.score}%` }}
              />
            </div>

            <p className="text-xs text-stone-600">
              {eipResult.components.environment.details}
            </p>
          </div>

          {/* 4. Mikrohabitat Gözlemleri (%20) */}
          <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Mikrohabitat Gözlemleri</h4>
                  <span className="text-[11px] text-stone-400">Ağırlık: %20 · Barınak Alanları</span>
                </div>
              </div>
              <span className={`text-base font-bold ${eipResult.components.microhabitats.hasData ? 'text-stone-800' : 'text-stone-400'}`}>
                {eipResult.components.microhabitats.hasData ? `${eipResult.components.microhabitats.score} / 100` : 'Veri Yok'}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
              <div 
                className="h-full bg-stone-700 rounded-full transition-all duration-500"
                style={{ width: `${eipResult.components.microhabitats.score}%` }}
              />
            </div>

            <p className="text-xs text-stone-600">
              {eipResult.components.microhabitats.details}
            </p>
          </div>

        </div>
      </div>

      {/* Microhabitats Registry Section */}
      <section className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Mikrohabitat Takip Listesi ({filteredHabitats.length})</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Toprağı nemli tutan taş altları, çürümüş kütükler ve böcek sığınakları mikroekosistemi besler.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Yeni Mikrohabitat Kaydet</span>
          </button>
        </div>

        {filteredHabitats.length === 0 ? (
          <div className="text-center py-8 bg-stone-50 rounded-xl border border-dashed border-stone-200 p-4">
            <p className="text-xs text-stone-500">Bu bölgede henüz mikrohabitat kaydı bulunmuyor.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredHabitats.map((hab) => (
              <div 
                key={hab.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-emerald-50/20 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-stone-900">{hab.habitatType}</span>
                    <button
                      onClick={() => onDeleteMicrohabitat(hab.id)}
                      className="text-stone-400 hover:text-red-600 p-1"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {hab.region} · {hab.date}
                  </div>
                  <p className="text-xs text-stone-700 mt-2 leading-relaxed">
                    {hab.description}
                  </p>
                </div>
                {hab.isDemo && (
                  <span className="mt-3 text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded self-start border border-amber-200">
                    DEMO
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Add Microhabitat Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Yeni Mikrohabitat Kaydı</h3>
                <p className="text-xs text-stone-500">Canlılara sığınak oluşturan alanı tanımlayın.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMicrohabitat} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Mikrohabitat Tipi *</label>
                <select
                  value={habitatType}
                  onChange={(e) => setHabitatType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
                >
                  {microhabitatPresetTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bölge *</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as RegionType)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Hatay">Hatay</option>
                    <option value="Kahramanmaraş">Kahramanmaraş</option>
                    <option value="Adıyaman">Adıyaman</option>
                    <option value="Okul Pilot Alanı">Okul Pilot Alanı</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Tarih *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Açıklama ve Canlı İzleri *</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu taşın veya kütüğün altında hangi böcekler, solucanlar veya mantarlar görüldü? Nem durumu nasıldı?"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-stone-200 text-stone-700 font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
