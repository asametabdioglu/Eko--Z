import { Measurement, Observation, Microhabitat, ResearchDossier, RegionType } from '../types';

const STORAGE_KEYS = {
  MEASUREMENTS: 'ekoiz_measurements_v1',
  OBSERVATIONS: 'ekoiz_observations_v1',
  MICROHABITATS: 'ekoiz_microhabitats_v1',
  DEMO_MODE: 'ekoiz_demo_mode_active',
  FIREBASE_CONFIG: 'ekoiz_firebase_custom_config'
};

// Initial Research Dossiers (Fixed research and field reference data)
export const INITIAL_RESEARCH_DOSSIERS: ResearchDossier[] = [
  {
    id: 'research-hatay',
    region: 'Hatay',
    title: 'Hatay Amanos Dağları ve Amik Ovası Ekosistem İyileşmesi',
    ecologicalFeatures: 'Akdeniz bitki örtüsü (maki ve kızılçam ormanları), zengin biyolojik çeşitlilik, Amanos Dağları endemik bitki türleri ve göçmen kuşların önemli durak noktası olan Amik Ovası havzası.',
    environmentalImpacts: 'Deprem sonrası zemin sıvılaşması, moloz döküm alanlarının doğal su kaynaklarına baskısı, habitat parçalanması ve yer altı su seviyelerindeki değişimler.',
    nativePlants: ['Defne (Laurus nobilis)', 'Mersin (Myrtus communis)', 'Kızılçam (Pinus brutia)', 'Hatay Dağ Adaçayı (Salvia aramiensis)', 'Amanos Çançiçeği (Campanula amana)'],
    animalSpecies: ['Hatay Dağ Ceylanı (Gazella marica)', 'Çizgili Sırtlan (Hyaena hyaena)', 'Küçük Kerkenez (Falco naumanni)', 'Amanos Geyik Böceği (Lucanus cervus akbesianus)'],
    restorationProjects: 'Amanos florasının rehabilitasyonu, doğal tohum saçılım koridorlarının oluşturulması, moloz ayrıştırma sonrası toprak organik madde zenginleştirme çalışmaları.',
    expertOpinions: 'Ekoloji Uzmanı Dr. Selin Erdem: "Hatay\'da toprak nemi ve mikrobiyota dengesi yeniden kuruldukça tohum bankası kendiliğinden uyanacaktır. Öğrencilerin ölçtüğü toprak nemi kritik göstergedir."',
    sources: ['TEMA Vakfı Hatay Ekolojik Durum Raporu', 'Doğa Derneği Amanos Biyoçeşitlilik İzleme Envanteri', 'Mustafa Kemal Üniversitesi Biyoloji Bölümü Yayınları'],
    projectContributions: 'EKOİZ ile pilot okul alanlarında toprak nemi ve organik canlanma sensörlerle takip edilebilir; öğrenciler fidan dikim noktalarındaki mikroiklimi anlık gözlemleyebilir.',
    heroImage: '/src/assets/images/research_hatay_nature_1794464383450.jpg'
  },
  {
    id: 'research-maras',
    region: 'Kahramanmaraş',
    title: 'Kahramanmaraş Ahır Dağı ve Aksu Havzası Restorasyonu',
    ecologicalFeatures: 'Akdeniz ile İran-Turan fitocoğrafik bölgelerinin geçiş kuşağı; yüksek rakımlı subalpin çayırlar, meşe ve sedir ormanları, zengin karstik su kaynakları.',
    environmentalImpacts: 'Heyelan ve yüzey kırılmaları sonucu toprak kayması, su yataklarının yön değiştirmesi ve hassas alpin bitki örtüsünün bozulması.',
    nativePlants: ['Ters Lale (Fritillaria imperialis)', 'Maraş Adaçayı (Salvia marashica)', 'Toros Sediri (Cedrus libani)', 'Doğu Karadeniz Meşesi', 'Kekik ve Geven Çalıları'],
    animalSpecies: ['Yaban Keçisi (Capra aegagrus)', 'Kaya Kartalı (Aquila chrysaetos)', 'Kafkas Semenderi', 'Toros Kertenkelesi', 'Yerel Tozlaştırıcı Yaban Arıları'],
    restorationProjects: 'Toprak erozyonunu önleyici biyomühendislik bentleri, Ahır Dağı teraslama ve endemik tohum toplama-ekme projeleri.',
    expertOpinions: 'Orman Mühendisi Kenan Aktaş: "Sıcaklık ve toprak nemi dengesini takip etmek fidan dikimi için en uygun zaman penceresini belirler."',
    sources: ['Sütçü İmam Üniversitesi Çevre Sorunları Uygulama Merkezi Raporu', 'Orman Genel Müdürlüğü Erozyon Kontrol Dairesi Verileri'],
    projectContributions: 'EKOİZ projesi, öğrencilerin Arduino sensörleriyle ölçtükleri toprak verilerini araştırmacılara açık veri formatında sunmasını sağlayabilir.',
    heroImage: '/src/assets/images/research_maras_nature_1794464385150.jpg'
  },
  {
    id: 'research-adiyaman',
    region: 'Adıyaman',
    title: 'Adıyaman Nemrut Dağı Etekleri ve Fırat Havzası Biyoçeşitliliği',
    ecologicalFeatures: 'Meşe ormanı kalıntıları, Fırat havzası sulak alan ekosistemleri, bozkır ve dağ step florası, zengin böcek ve kuş faunası.',
    environmentalImpacts: 'Yüzey çatlakları, tarımsal sulama altyapılarının hasarı sonucu lokal kuraklık ve toz emisyonlarının bitki fotosentezini baskılaması.',
    nativePlants: ['Fırat Geveni (Astragalus)', 'Tüylü Meşe (Quercus pubescens)', 'Yabani Badem (Amygdalus)', 'Kaya Kekiği', 'Süsen (Iris sp.)'],
    animalSpecies: ['Fırat Kaplumbağası (Rafetus euphraticus)', 'Alaca Yalıçapkını (Ceryle rudis)', 'Bozkır Kartalı', 'Bayağı Bukalemun'],
    restorationProjects: 'Fırat kıyısı taşkın yatağı sazlıklarının korunması, kuraklığa dayanıklı yerel meşe palamutlarının ekimi, arıcılık koridorlarının ihyası.',
    expertOpinions: 'Ziraat Yüksek Mühendisi Aylin Çetin: "Böcek ve tozlaştırıcı varlığı ekosistem sağlığının en hassas barometresidir."',
    sources: ['Güneydoğu Anadolu Biyoçeşitlilik Raporu', 'Adıyaman Üniversitesi Ekoloji Çalışma Grubu Bülteni'],
    projectContributions: 'EKOİZ sayesinde öğrenciler kendi bahçelerinde mikrohabitat oluşturup tozlaştırıcı böcekleri sayarak verileri bilimsel yöntemle kaydedebilir.',
    heroImage: '/src/assets/images/research_adiyaman_nature_1794464384732.jpg'
  }
];

// Realistic Initial Measurements for Demonstration (marked with isDemo: true)
export const INITIAL_DEMO_MEASUREMENTS: Measurement[] = [
  {
    id: 'm-demo-1',
    region: 'Okul Pilot Alanı',
    locationName: 'FLL Deneme Parseli A-1 (Kompostlu Toprak)',
    date: '2026-05-08T10:30',
    soilMoisture: 48,
    temperature: 21.5,
    airHumidity: 58,
    lightLevel: 720,
    studentTeam: 'Biyoglow Kaşifleri Takımı',
    description: 'Arduino UNO + Toprak Nem Sensörü (analog A0) ve DHT11 ile okundu. Toprak gevşek ve nemli.',
    dataSource: 'Arduino UNO ile yapılan pilot ölçüm',
    isDemo: true,
    createdAt: '2026-05-08T10:32:00.000Z'
  },
  {
    id: 'm-demo-2',
    region: 'Okul Pilot Alanı',
    locationName: 'FLL Deneme Parseli B-2 (Kontrol Alanı)',
    date: '2026-05-09T14:15',
    soilMoisture: 32,
    temperature: 24.2,
    airHumidity: 46,
    lightLevel: 890,
    studentTeam: 'Robotik Ekibi - Sensör Grubu',
    description: 'Öğle saatinde doğrudan güneş alan kontrol alanı. Toprak nemi kompostlu parselden belirgin şekilde düşük.',
    dataSource: 'Arduino UNO ile yapılan pilot ölçüm',
    isDemo: true,
    createdAt: '2026-05-09T14:18:00.000Z'
  },
  {
    id: 'm-demo-3',
    region: 'Hatay',
    locationName: 'Defne Pilot Rehabilitasyon Fidanlığı',
    date: '2026-05-10T09:45',
    soilMoisture: 55,
    temperature: 22.0,
    airHumidity: 62,
    lightLevel: 680,
    studentTeam: 'Genç Doğa Dedektifleri',
    description: 'Damla sulama uygulanan ve ağaç kabuğu malçı serilmiş fidanlık tabanı.',
    dataSource: 'Manuel gözlem veya araştırma verisi',
    isDemo: true,
    createdAt: '2026-05-10T09:50:00.000Z'
  },
  {
    id: 'm-demo-4',
    region: 'Kahramanmaraş',
    locationName: 'Ahır Dağı Etekleri Genç Sedir Sahası',
    date: '2026-05-11T11:20',
    soilMoisture: 42,
    temperature: 19.8,
    airHumidity: 52,
    lightLevel: 810,
    studentTeam: 'Yeşil Çözümler Takımı',
    description: 'Erozyon önleyici taş setlerin arka tarafında biriken humuslu toprak katmanı.',
    dataSource: 'Arduino UNO ile yapılan pilot ölçüm',
    isDemo: true,
    createdAt: '2026-05-11T11:25:00.000Z'
  },
  {
    id: 'm-demo-5',
    region: 'Adıyaman',
    locationName: 'Fırat Havzası Meşe Tohumlama Noktası',
    date: '2026-05-12T15:00',
    soilMoisture: 38,
    temperature: 25.5,
    airHumidity: 44,
    lightLevel: 940,
    studentTeam: 'Biyoglow Kaşifleri Takımı',
    description: 'Öğleden sonra sıcaklık yükseldi. Rüzgar etkisiyle yüzey nemi hızlı buharlaşıyor.',
    dataSource: 'Arduino UNO ile yapılan pilot ölçüm',
    isDemo: true,
    createdAt: '2026-05-12T15:05:00.000Z'
  }
];

export const INITIAL_DEMO_OBSERVATIONS: Observation[] = [
  {
    id: 'obs-demo-1',
    category: 'plant',
    name: 'Defne Fidanı',
    species: 'Laurus nobilis',
    region: 'Hatay',
    date: '2026-05-09',
    developmentStatus: 'Filizlendi',
    description: 'Depremden sonra dikilen fidanlardan 4 tanesi yeni yaprak sürgünü verdi.',
    isDemo: true,
    createdAt: '2026-05-09T10:00:00.000Z'
  },
  {
    id: 'obs-demo-2',
    category: 'plant',
    name: 'Kızılçam Filizi',
    species: 'Pinus brutia',
    region: 'Okul Pilot Alanı',
    date: '2026-05-10',
    developmentStatus: 'Gelişiyor',
    description: 'Saksıda çimlendirilen tohum yaklaşık 7 cm boya ulaştı. İğne yapraklar belirginleşti.',
    isDemo: true,
    createdAt: '2026-05-10T11:15:00.000Z'
  },
  {
    id: 'obs-demo-3',
    category: 'plant',
    name: 'Maraş Adaçayı',
    species: 'Salvia marashica',
    region: 'Kahramanmaraş',
    date: '2026-05-11',
    developmentStatus: 'Çiçek açtı',
    description: 'Taşlık yamaçta mor çiçekleri açmış olarak gözlemlendi. Tozlaştırıcı böcekler yoğun.',
    isDemo: true,
    createdAt: '2026-05-11T13:40:00.000Z'
  },
  {
    id: 'obs-demo-4',
    category: 'animal',
    name: 'Kafkas Yaban Arısı',
    species: 'Apis mellifera caucasica',
    region: 'Kahramanmaraş',
    date: '2026-05-11',
    animalCategory: 'Böcek',
    observationCount: 12,
    description: 'Adaçayı ve kekik çiçekleri üzerinde yoğun nektar toplama faaliyeti gözlendi.',
    isDemo: true,
    createdAt: '2026-05-11T14:00:00.000Z'
  },
  {
    id: 'obs-demo-5',
    category: 'animal',
    name: 'Hatay Dağ Ceylanı',
    species: 'Gazella marica',
    region: 'Hatay',
    date: '2026-05-08',
    animalCategory: 'Memeli',
    observationCount: 3,
    description: 'Kırıkhan koruma alanı sınırlarında otlarken uzaktan gözlemlendi.',
    isDemo: true,
    createdAt: '2026-05-08T08:30:00.000Z'
  },
  {
    id: 'obs-demo-6',
    category: 'animal',
    name: 'Yedi Noktalı Uğur Böceği',
    species: 'Coccinella septempunctata',
    region: 'Okul Pilot Alanı',
    date: '2026-05-12',
    animalCategory: 'Böcek',
    observationCount: 5,
    description: 'Fidan yapraklarındaki yaprak bitlerini avlarken gözlemlendi. Doğal biyolojik mücadele!',
    isDemo: true,
    createdAt: '2026-05-12T16:20:00.000Z'
  }
];

export const INITIAL_DEMO_MICROHABITATS: Microhabitat[] = [
  {
    id: 'hab-demo-1',
    region: 'Okul Pilot Alanı',
    habitatType: 'Nemli Çürümüş Kütük Barınağı',
    date: '2026-05-07',
    description: 'Öğrenciler tarafından gölgeli köşeye yerleştirilen kütük altında karıncalar ve tespih böcekleri kolonileşti.',
    isDemo: true,
    createdAt: '2026-05-07T12:00:00.000Z'
  },
  {
    id: 'hab-demo-2',
    region: 'Kahramanmaraş',
    habitatType: 'Karstik Taş Altı Mikro-Ekosistemi',
    date: '2026-05-10',
    description: 'Kireçtaşı bloklarının gölgesinde toprak sıcaklığı açık alana göre 5 derece daha serin.',
    isDemo: true,
    createdAt: '2026-05-10T11:00:00.000Z'
  },
  {
    id: 'hab-demo-3',
    region: 'Hatay',
    habitatType: 'Çalı Altı Malç ve Yaprak Tabakası',
    date: '2026-05-11',
    description: 'Defne yapraklarının oluşturduğu doğal örtü nemi koruyor; solucan faaliyeti yoğun.',
    isDemo: true,
    createdAt: '2026-05-11T15:30:00.000Z'
  }
];

export const StorageService = {
  // Measurements
  getMeasurements(): Measurement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(INITIAL_DEMO_MEASUREMENTS));
      return INITIAL_DEMO_MEASUREMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_MEASUREMENTS;
    }
  },

  addMeasurement(measurement: Omit<Measurement, 'id' | 'createdAt'>): Measurement {
    const list = this.getMeasurements();
    const newRecord: Measurement = {
      ...measurement,
      id: 'm-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
      isDemo: false
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(list));
    return newRecord;
  },

  updateMeasurement(id: string, updated: Partial<Measurement>): Measurement | null {
    const list = this.getMeasurements();
    const index = list.findIndex(m => m.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updated };
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(list));
    return list[index];
  },

  deleteMeasurement(id: string): boolean {
    const list = this.getMeasurements();
    const filtered = list.filter(m => m.id !== id);
    if (filtered.length === list.length) return false;
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(filtered));
    return true;
  },

  // Observations
  getObservations(): Observation[] {
    const raw = localStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(INITIAL_DEMO_OBSERVATIONS));
      return INITIAL_DEMO_OBSERVATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_OBSERVATIONS;
    }
  },

  addObservation(observation: Omit<Observation, 'id' | 'createdAt'>): Observation {
    const list = this.getObservations();
    const newRecord: Observation = {
      ...observation,
      id: 'obs-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
      isDemo: false
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(list));
    return newRecord;
  },

  updateObservation(id: string, updated: Partial<Observation>): Observation | null {
    const list = this.getObservations();
    const index = list.findIndex(o => o.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updated };
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(list));
    return list[index];
  },

  deleteObservation(id: string): boolean {
    const list = this.getObservations();
    const filtered = list.filter(o => o.id !== id);
    if (filtered.length === list.length) return false;
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(filtered));
    return true;
  },

  // Microhabitats
  getMicrohabitats(): Microhabitat[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MICROHABITATS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MICROHABITATS, JSON.stringify(INITIAL_DEMO_MICROHABITATS));
      return INITIAL_DEMO_MICROHABITATS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_MICROHABITATS;
    }
  },

  addMicrohabitat(habitat: Omit<Microhabitat, 'id' | 'createdAt'>): Microhabitat {
    const list = this.getMicrohabitats();
    const newRecord: Microhabitat = {
      ...habitat,
      id: 'hab-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
      isDemo: false
    };
    list.unshift(newRecord);
    localStorage.setItem(STORAGE_KEYS.MICROHABITATS, JSON.stringify(list));
    return newRecord;
  },

  deleteMicrohabitat(id: string): boolean {
    const list = this.getMicrohabitats();
    const filtered = list.filter(h => h.id !== id);
    if (filtered.length === list.length) return false;
    localStorage.setItem(STORAGE_KEYS.MICROHABITATS, JSON.stringify(filtered));
    return true;
  },

  // Research Dossiers
  getResearchDossiers(): ResearchDossier[] {
    return INITIAL_RESEARCH_DOSSIERS;
  },

  // Reset to Demo
  resetToDemo(): void {
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(INITIAL_DEMO_MEASUREMENTS));
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(INITIAL_DEMO_OBSERVATIONS));
    localStorage.setItem(STORAGE_KEYS.MICROHABITATS, JSON.stringify(INITIAL_DEMO_MICROHABITATS));
  },

  // Clear all demo data so students can work with only clean records
  clearAllData(): void {
    localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MICROHABITATS, JSON.stringify([]));
  },

  // Export JSON
  exportDataJson(): string {
    const exportObject = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      measurements: this.getMeasurements(),
      observations: this.getObservations(),
      microhabitats: this.getMicrohabitats()
    };
    return JSON.stringify(exportObject, null, 2);
  },

  // Import JSON
  importDataJson(jsonString: string): { success: boolean; message: string; count?: number } {
    try {
      const data = JSON.parse(jsonString);
      if (!Array.isArray(data.measurements) || !Array.isArray(data.observations)) {
        return { success: false, message: 'Geçersiz veri dosyası yapısı.' };
      }
      localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(data.measurements));
      localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(data.observations));
      if (Array.isArray(data.microhabitats)) {
        localStorage.setItem(STORAGE_KEYS.MICROHABITATS, JSON.stringify(data.microhabitats));
      }
      const total = data.measurements.length + data.observations.length + (data.microhabitats?.length || 0);
      return { success: true, message: 'Veriler başarıyla içe aktarıldı.', count: total };
    } catch {
      return { success: false, message: 'JSON dosyası okunamadı veya biçimi bozuk.' };
    }
  }
};
