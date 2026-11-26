import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sprout, 
  Bug, 
  PlusCircle, 
  Filter, 
  Trash2, 
  Edit3, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  Upload, 
  CheckCircle2, 
  X,
  AlertTriangle
} from 'lucide-react';
import { 
  Observation, 
  RegionType, 
  PlantDevelopmentStatus, 
  AnimalCategoryType 
} from '../../types';

interface ObservationsViewProps {
  observations: Observation[];
  onAddObservation: (observation: Omit<Observation, 'id' | 'createdAt'>) => void;
  onUpdateObservation: (id: string, updated: Partial<Observation>) => void;
  onDeleteObservation: (id: string) => void;
}

export const ObservationsView: React.FC<ObservationsViewProps> = ({
  observations,
  onAddObservation,
  onUpdateObservation,
  onDeleteObservation
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'plant' | 'animal'>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingObservation, setEditingObservation] = useState<Observation | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [category, setCategory] = useState<'plant' | 'animal'>('plant');
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [region, setRegion] = useState<RegionType>('Okul Pilot Alanı');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [developmentStatus, setDevelopmentStatus] = useState<PlantDevelopmentStatus>('Filizlendi');
  const [animalCategory, setAnimalCategory] = useState<AnimalCategoryType>('Böcek');
  const [observationCount, setObservationCount] = useState<number>(1);
  const [photoURL, setPhotoURL] = useState<string>('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const plantStatusOptions: PlantDevelopmentStatus[] = [
    'Yeni ekildi',
    'Filizlendi',
    'Gelişiyor',
    'Çiçek açtı',
    'Kurudu',
    'Gözlem devam ediyor'
  ];

  const animalCategoryOptions: AnimalCategoryType[] = [
    'Kuş',
    'Böcek',
    'Memeli',
    'Sürüngen',
    'Amfibi',
    'Diğer'
  ];

  const resetForm = () => {
    setCategory('plant');
    setName('');
    setSpecies('');
    setRegion('Okul Pilot Alanı');
    setDate(new Date().toISOString().substring(0, 10));
    setDevelopmentStatus('Filizlendi');
    setAnimalCategory('Böcek');
    setObservationCount(1);
    setPhotoURL('');
    setDescription('');
    setFormError(null);
    setEditingObservation(null);
  };

  const handleOpenAdd = (defaultCategory: 'plant' | 'animal' = 'plant') => {
    resetForm();
    setCategory(defaultCategory);
    setModalOpen(true);
  };

  const handleOpenEdit = (obs: Observation) => {
    setEditingObservation(obs);
    setCategory(obs.category);
    setName(obs.name);
    setSpecies(obs.species);
    setRegion(obs.region);
    setDate(obs.date);
    if (obs.developmentStatus) setDevelopmentStatus(obs.developmentStatus);
    if (obs.animalCategory) setAnimalCategory(obs.animalCategory);
    if (obs.observationCount) setObservationCount(obs.observationCount);
    setPhotoURL(obs.photoURL || '');
    setDescription(obs.description);
    setModalOpen(true);
  };

  // Image upload handler (converts uploaded file to base64 data url)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Lütfen 2MB dan küçük bir fotoğraf seçiniz.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPhotoURL(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Lütfen canlı veya bitki adını girin');
      return;
    }
    if (!date) {
      setFormError('Lütfen gözlem tarihini seçin');
      return;
    }

    if (editingObservation) {
      onUpdateObservation(editingObservation.id, {
        category,
        name: name.trim(),
        species: species.trim() || name.trim(),
        region,
        date,
        developmentStatus: category === 'plant' ? developmentStatus : undefined,
        animalCategory: category === 'animal' ? animalCategory : undefined,
        observationCount: category === 'animal' ? Number(observationCount) || 1 : undefined,
        photoURL: photoURL.trim() || undefined,
        description: description.trim()
      });
    } else {
      onAddObservation({
        category,
        name: name.trim(),
        species: species.trim() || name.trim(),
        region,
        date,
        developmentStatus: category === 'plant' ? developmentStatus : undefined,
        animalCategory: category === 'animal' ? animalCategory : undefined,
        observationCount: category === 'animal' ? Number(observationCount) || 1 : undefined,
        photoURL: photoURL.trim() || undefined,
        description: description.trim()
      });

      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#22C55E', '#14532D', '#D97706']
        });
      } catch {
        // safe fallback
      }
    }

    setModalOpen(false);
    resetForm();
  };

  // Filter observations
  const filtered = observations.filter(obs => {
    if (activeTab !== 'all' && obs.category !== activeTab) return false;
    if (regionFilter !== 'all' && obs.region !== regionFilter) return false;
    return true;
  });

  const plantCount = observations.filter(o => o.category === 'plant').length;
  const animalCount = observations.filter(o => o.category === 'animal').length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Canlı Gözlem Merkezi
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Afet bölgesinde ve okul pilot alanında filizlenen bitkileri, tozlaştırıcıları ve yaban hayatı kaydedin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenAdd('plant')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
          >
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span>+ Bitki Ekle</span>
          </button>
          <button
            onClick={() => handleOpenAdd('animal')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
          >
            <Bug className="w-4 h-4 text-amber-700" />
            <span>+ Hayvan/Böcek Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Region Selector */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Tüm Canlılar ({observations.length})
          </button>
          <button
            onClick={() => setActiveTab('plant')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'plant'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Sprout className="w-3.5 h-3.5" />
            Bitkiler ({plantCount})
          </button>
          <button
            onClick={() => setActiveTab('animal')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'animal'
                ? 'bg-emerald-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            Hayvanlar ({animalCount})
          </button>
        </div>

        {/* Region filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="obs-region-filter" className="text-xs font-semibold text-stone-500 whitespace-nowrap">
            Bölge Filtresi:
          </label>
          <select
            id="obs-region-filter"
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
        </div>
      </div>

      {/* Observations Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-900">Henüz Canlı Gözlemi Bulunamadı</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1 mb-5">
            Seçtiğiniz filtrede gözlem kaydı bulunmuyor. Yeni bir bitki filizi veya böcek kaydı ekleyerek ekosistem veritabanını zenginleştirin.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleOpenAdd('plant')}
              className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Bitki Gözlemi Ekle
            </button>
            <button
              onClick={() => handleOpenAdd('animal')}
              className="px-4 py-2 bg-amber-700 text-white text-xs font-semibold rounded-lg hover:bg-amber-800 transition-colors"
            >
              Hayvan Gözlemi Ekle
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((obs) => {
            const isPlant = obs.category === 'plant';
            return (
              <div 
                key={obs.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo or Styled Category Banner */}
                  <div className="h-44 bg-stone-100 relative overflow-hidden flex items-center justify-center">
                    {obs.photoURL ? (
                      <img 
                        src={obs.photoURL} 
                        alt={obs.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className={`w-full h-full flex flex-col items-center justify-center p-4 text-center ${
                        isPlant ? 'bg-gradient-to-br from-emerald-100 to-green-50 text-emerald-800' : 'bg-gradient-to-br from-amber-100 to-orange-50 text-amber-800'
                      }`}>
                        {isPlant ? <Sprout className="w-10 h-10 mb-2 opacity-80" /> : <Bug className="w-10 h-10 mb-2 opacity-80" />}
                        <span className="text-xs font-semibold">{obs.species}</span>
                        <span className="text-[11px] opacity-75 mt-0.5">Fotoğraf eklenmedi</span>
                      </div>
                    )}

                    {/* Badge top-left */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-xs ${
                        isPlant ? 'bg-emerald-800 text-white' : 'bg-amber-800 text-white'
                      }`}>
                        {isPlant ? 'Bitki' : `Hayvan (${obs.animalCategory || 'Böcek'})`}
                      </span>
                      {obs.isDemo && (
                        <span className="text-[10px] font-semibold bg-white/90 text-stone-700 px-2 py-0.5 rounded shadow-xs">
                          DEMO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-base font-bold text-stone-900">{obs.name}</h3>
                      <p className="text-xs text-stone-500 italic">{obs.species}</p>
                    </div>

                    {/* Metadata details */}
                    <div className="space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Bölge:</span>
                        <span className="font-semibold text-stone-800">{obs.region}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400">Tarih:</span>
                        <span className="font-semibold text-stone-800">{obs.date}</span>
                      </div>
                      {isPlant && obs.developmentStatus && (
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Gelişim Durumu:</span>
                          <span className="font-bold text-emerald-800">{obs.developmentStatus}</span>
                        </div>
                      )}
                      {!isPlant && (
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Gözlem Sayısı:</span>
                          <span className="font-bold text-amber-900">{obs.observationCount || 1} adet</span>
                        </div>
                      )}
                    </div>

                    {obs.description && (
                      <p className="text-xs text-stone-700 leading-relaxed line-clamp-2">
                        {obs.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    Eklenme: {new Date(obs.createdAt).toLocaleDateString('tr-TR')}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(obs)}
                      className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                      title="Gözlemi Düzenle"
                      aria-label="Gözlemi Düzenle"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(obs.id)}
                      className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Gözlemi Sil"
                      aria-label="Gözlemi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-stone-200 my-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {editingObservation ? 'Canlı Gözlemini Düzenle' : 'Yeni Canlı Gözlemi Ekle'}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Ekosistem çeşitliliğini belgelemek için detayları girin.
                </p>
              </div>
              <button
                onClick={() => { setModalOpen(false); resetForm(); }}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Category Picker (Bitki vs Hayvan) */}
              {!editingObservation && (
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Gözlem Kategorisi</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory('plant')}
                      className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        category === 'plant'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <span>Bitki Gözlemi</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory('animal')}
                      className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        category === 'animal'
                          ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Bug className="w-4 h-4 text-amber-600" />
                      <span>Hayvan / Böcek</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Name & Species */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="obs-name" className="block font-semibold text-stone-700 mb-1">
                    {category === 'plant' ? 'Bitki Adı *' : 'Canlı Adı *'}
                  </label>
                  <input
                    id="obs-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={category === 'plant' ? 'Örn: Defne, Kızılçam, Ters Lale' : 'Örn: Bal Arısı, Uğur Böceği, Dağ Ceylanı'}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label htmlFor="obs-species" className="block font-semibold text-stone-700 mb-1">
                    {category === 'plant' ? 'Bitki Türü / Bilimsel Adı' : 'Canlı Türü / Bilimsel Adı'}
                  </label>
                  <input
                    id="obs-species"
                    type="text"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    placeholder="Örn: Laurus nobilis, Apis mellifera"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Region & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="obs-region" className="block font-semibold text-stone-700 mb-1">
                    Gözlem Yapılan Bölge *
                  </label>
                  <select
                    id="obs-region"
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
                  <label htmlFor="obs-date" className="block font-semibold text-stone-700 mb-1">
                    Gözlem Tarihi *
                  </label>
                  <input
                    id="obs-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Conditional Category Attributes */}
              {category === 'plant' ? (
                <div>
                  <label htmlFor="plant-dev-status" className="block font-semibold text-stone-700 mb-1">
                    Bitkinin Gelişim Durumu *
                  </label>
                  <select
                    id="plant-dev-status"
                    value={developmentStatus}
                    onChange={(e) => setDevelopmentStatus(e.target.value as PlantDevelopmentStatus)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {plantStatusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="animal-cat" className="block font-semibold text-stone-700 mb-1">
                      Canlı Kategorisi *
                    </label>
                    <select
                      id="animal-cat"
                      value={animalCategory}
                      onChange={(e) => setAnimalCategory(e.target.value as AnimalCategoryType)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-amber-600"
                    >
                      {animalCategoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="animal-count" className="block font-semibold text-stone-700 mb-1">
                      Gözlem Sayısı (Adet) *
                    </label>
                    <input
                      id="animal-count"
                      type="number"
                      min="1"
                      max="1000"
                      value={observationCount}
                      onChange={(e) => setObservationCount(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-amber-600"
                    />
                  </div>
                </div>
              )}

              {/* Photo Upload & Preview */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Fotoğraf Yükleme (Dosya veya URL)
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-2.5 px-3 border border-dashed border-stone-300 hover:border-emerald-500 rounded-lg bg-stone-50 text-stone-600 text-xs font-medium transition-colors">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Cihazdan Fotoğraf Seç</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                  {photoURL && (
                    <button
                      type="button"
                      onClick={() => setPhotoURL('')}
                      className="text-xs text-red-600 px-2.5 py-2 rounded-lg border border-red-200 hover:bg-red-50"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
                {photoURL && (
                  <div className="mt-2 h-24 rounded-lg overflow-hidden border border-stone-200">
                    <img src={photoURL} alt="Önizleme" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="obs-desc" className="block font-semibold text-stone-700 mb-1">
                  Açıklama & Gözlem Notu
                </label>
                <textarea
                  id="obs-desc"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Canlının bulunduğu mikroçevre, yaprak durumu, davranışları vb."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setModalOpen(false); resetForm(); }}
                  className="px-4 py-2 rounded-lg border border-stone-200 text-stone-700 font-semibold hover:bg-stone-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors shadow-sm"
                >
                  {editingObservation ? 'Güncellemeyi Kaydet' : 'Gözlemi Kaydet'}
                </button>
              </div>

            </form>
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
              <h3 className="text-base font-bold text-stone-900">Gözlemi Silmek İstiyor musunuz?</h3>
              <p className="text-xs text-stone-600">
                Bu canlı gözlemi veritabanından ve Ekosistem İyileşme Puanı (EİP) hesaplamasından silinecektir.
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
                onClick={() => {
                  onDeleteObservation(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
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
