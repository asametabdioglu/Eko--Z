import React, { useState } from 'react';
import { 
  MapPin, 
  BookOpen, 
  Sprout, 
  Bug, 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { ResearchDossier, RegionType } from '../../types';
import { INITIAL_RESEARCH_DOSSIERS } from '../../services/storage';

interface ResearchMapViewProps {
  initialSelectedRegion?: RegionType;
}

export const ResearchMapView: React.FC<ResearchMapViewProps> = ({
  initialSelectedRegion = 'Hatay'
}) => {
  const dossiers = INITIAL_RESEARCH_DOSSIERS;
  const [selectedRegion, setSelectedRegion] = useState<RegionType>(
    initialSelectedRegion === 'Kahramanmaraş' || initialSelectedRegion === 'Adıyaman'
      ? initialSelectedRegion
      : 'Hatay'
  );

  const activeDossier = dossiers.find(d => d.region === selectedRegion) || dossiers[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Scientific Separation Banner */}
      <div>
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Bölgesel Ekolojik İnceleme & Saha Literatürü</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Ekosistem Araştırma Haritası
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl leading-relaxed">
          6 Şubat 2023 depremlerinden etkilenen öncelikli bölgelerin ekolojik yapısı, endemik türleri, afet sonrası çevresel etkileri ve restorasyon çalışmaları.
        </p>
      </div>

      {/* Crucial Scientific Boundary Warning */}
      <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
          <strong className="font-bold">Önemli Bilimsel İlke:</strong> Bu sayfada yer alan bilgiler akademik literatür, üniversite raporları ve TEMA Vakfı araştırmalarından derlenmiştir. Öğrencilerin okul ortamında veya pilot bahçelerde Arduino UNO ile yaptıkları sensör ölçümleri ile bu araştırma verileri birbirinden tamamen ayrı tutulmaktadır.
        </div>
      </div>

      {/* Interactive Map & Region Selector Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Interactive Turkey Regional Focus SVG Map */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Öncelikli Araştırma Bölgeleri</span>
            </h3>
            <span className="text-[11px] text-stone-500 font-medium">Bölge seçiniz</span>
          </div>

          {/* Stylized Interactive Map Canvas */}
          <div className="relative bg-gradient-to-b from-stone-50 to-emerald-50/40 rounded-xl p-4 border border-stone-200/80 overflow-hidden">
            {/* SVG Turkey & Fault Line Region Representation */}
            <svg viewBox="0 0 500 280" className="w-full h-auto drop-shadow-xs">
              <defs>
                <linearGradient id="turkeyBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>

              {/* Simplified Turkey Outline Silhouette */}
              <path
                d="M 25 110 Q 70 85 130 90 Q 200 80 270 85 Q 350 75 440 95 Q 480 120 465 170 Q 430 195 380 205 Q 310 220 230 205 Q 160 215 90 195 Q 40 180 25 140 Z"
                fill="url(#turkeyBg)"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              {/* Mediterranean & Black sea markers */}
              <text x="250" y="55" fill="#94a3b8" fontSize="12" fontFamily="sans-serif" textAnchor="middle">KARADENİZ</text>
              <text x="210" y="250" fill="#94a3b8" fontSize="12" fontFamily="sans-serif" textAnchor="middle">AKDENİZ</text>

              {/* East Anatolian Fault Line Indication (Soft dashed) */}
              <path
                d="M 270 230 Q 300 195 340 160"
                fill="none"
                stroke="#f87171"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                opacity="0.8"
              />

              {/* Hatay Point */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedRegion('Hatay')}
              >
                <circle
                  cx="280"
                  cy="225"
                  r={selectedRegion === 'Hatay' ? 14 : 9}
                  fill={selectedRegion === 'Hatay' ? '#14532D' : '#059669'}
                  stroke="#ffffff"
                  strokeWidth="3"
                  className="transition-all duration-200"
                />
                <text
                  x="280"
                  y="248"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={selectedRegion === 'Hatay' ? '#14532D' : '#334155'}
                >
                  Hatay
                </text>
              </g>

              {/* Kahramanmaraş Point */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedRegion('Kahramanmaraş')}
              >
                <circle
                  cx="305"
                  cy="185"
                  r={selectedRegion === 'Kahramanmaraş' ? 14 : 9}
                  fill={selectedRegion === 'Kahramanmaraş' ? '#14532D' : '#059669'}
                  stroke="#ffffff"
                  strokeWidth="3"
                  className="transition-all duration-200"
                />
                <text
                  x="305"
                  y="168"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={selectedRegion === 'Kahramanmaraş' ? '#14532D' : '#334155'}
                >
                  K.Maraş
                </text>
              </g>

              {/* Adıyaman Point */}
              <g 
                className="cursor-pointer group"
                onClick={() => setSelectedRegion('Adıyaman')}
              >
                <circle
                  cx="345"
                  cy="175"
                  r={selectedRegion === 'Adıyaman' ? 14 : 9}
                  fill={selectedRegion === 'Adıyaman' ? '#14532D' : '#059669'}
                  stroke="#ffffff"
                  strokeWidth="3"
                  className="transition-all duration-200"
                />
                <text
                  x="350"
                  y="198"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill={selectedRegion === 'Adıyaman' ? '#14532D' : '#334155'}
                >
                  Adıyaman
                </text>
              </g>
            </svg>
          </div>

          {/* Region Picker Buttons */}
          <div className="space-y-2">
            {[
              { id: 'Hatay', name: 'Hatay', subtitle: 'Amanos Dağları & Amik Havzası' },
              { id: 'Kahramanmaraş', name: 'Kahramanmaraş', subtitle: 'Ahır Dağı & Aksu Çayı Ekosistemi' },
              { id: 'Adıyaman', name: 'Adıyaman', subtitle: 'Nemrut Dağı Etekleri & Fırat Havzası' }
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id as RegionType)}
                className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  selectedRegion === r.id
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                    : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-stone-900">{r.name}</div>
                  <div className="text-xs text-stone-500">{r.subtitle}</div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  selectedRegion === r.id ? 'text-emerald-700 translate-x-1' : 'text-stone-400'
                }`} />
              </button>
            ))}
          </div>

        </div>

        {/* Right Side: Detailed Research Dossier for Selected Region */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            
            {/* Dossier Hero Image & Title */}
            <div className="relative h-60 bg-stone-900">
              <img 
                src={activeDossier.heroImage} 
                alt={activeDossier.region}
                className="w-full h-full object-cover opacity-90"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-1">
                  Ekolojik Saha Araştırma Dosyası
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {activeDossier.title}
                </h2>
              </div>
            </div>

            {/* 7 Core Research Information Points */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* 1. Ekolojik Özellikler */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">1</span>
                  Bölgenin Ekolojik Özellikleri
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pl-7">
                  {activeDossier.ecologicalFeatures}
                </p>
              </div>

              {/* 2. Afet Sonrası Çevresel Etkiler */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">2</span>
                  Afet Sonrasında Araştırılan Çevresel Etkiler
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pl-7">
                  {activeDossier.environmentalImpacts}
                </p>
              </div>

              {/* 3. Yerel Bitki Türleri */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">3</span>
                  Bölgedeki Yerel ve Endemik Bitki Türleri
                </h3>
                <div className="flex flex-wrap gap-2 pl-7">
                  {activeDossier.nativePlants.map((plant, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-1.5"
                    >
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                      {plant}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4. Hayvan Türleri ve Yaşam Alanları */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-bold">4</span>
                  Bölgedeki Hayvan Türleri ve Yaşam Alanları
                </h3>
                <div className="flex flex-wrap gap-2 pl-7">
                  {activeDossier.animalSpecies.map((animal, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-1.5"
                    >
                      <Bug className="w-3.5 h-3.5 text-amber-600" />
                      {animal}
                    </span>
                  ))}
                </div>
              </div>

              {/* 5. İyileştirme Çalışmaları */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-bold">5</span>
                  Bölgede Gerçekleştirilen Ekosistem İyileştirme Çalışmaları
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pl-7">
                  {activeDossier.restorationProjects}
                </p>
              </div>

              {/* 6. Kaynaklar ve Uzman Görüşleri */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 text-xs flex items-center justify-center font-bold">6</span>
                  Kaynaklar ve Uzman Görüşleri
                </h3>
                <div className="pl-7 space-y-2">
                  <blockquote className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700 italic">
                    "{activeDossier.expertOpinions}"
                  </blockquote>
                  <div className="text-[11px] text-stone-500 space-y-0.5">
                    <span className="font-semibold block text-stone-600">İncelenen Bilimsel Kaynaklar:</span>
                    {activeDossier.sources.map((src, i) => (
                      <div key={i}>• {src}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 7. EKOİZ Katkısı */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <span>7. EKOİZ Projesinin Bölgeye Sağlayabileceği Katkılar</span>
                </h3>
                <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  {activeDossier.projectContributions}
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
