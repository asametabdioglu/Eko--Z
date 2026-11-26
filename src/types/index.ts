export type RegionType = 'Hatay' | 'Kahramanmaraş' | 'Adıyaman' | 'Okul Pilot Alanı' | 'Diğer';

export type DataSourceType = 
  | 'Arduino UNO ile yapılan pilot ölçüm' 
  | 'Manuel gözlem veya araştırma verisi';

export interface Measurement {
  id: string;
  region: RegionType;
  locationName: string;
  date: string; // YYYY-MM-DD or ISO
  soilMoisture: number; // % (0-100)
  temperature: number; // °C
  airHumidity: number; // % (0-100)
  lightLevel: number; // analog sensor reading (0-1023)
  studentTeam: string;
  description: string;
  dataSource: DataSourceType;
  isDemo?: boolean;
  createdAt: string;
}

export type PlantDevelopmentStatus = 
  | 'Yeni ekildi' 
  | 'Filizlendi' 
  | 'Gelişiyor' 
  | 'Çiçek açtı' 
  | 'Kurudu' 
  | 'Gözlem devam ediyor';

export type AnimalCategoryType = 
  | 'Kuş' 
  | 'Böcek' 
  | 'Memeli' 
  | 'Sürüngen' 
  | 'Amfibi' 
  | 'Diğer';

export interface Observation {
  id: string;
  category: 'plant' | 'animal';
  name: string;
  species: string;
  region: RegionType;
  date: string;
  developmentStatus?: PlantDevelopmentStatus;
  animalCategory?: AnimalCategoryType;
  observationCount?: number;
  photoURL?: string;
  description: string;
  isDemo?: boolean;
  createdAt: string;
}

export interface Microhabitat {
  id: string;
  region: RegionType;
  habitatType: string;
  date: string;
  description: string;
  photoURL?: string;
  isDemo?: boolean;
  createdAt?: string;
}

export interface ResearchDossier {
  id: string;
  region: RegionType;
  title: string;
  ecologicalFeatures: string;
  environmentalImpacts: string;
  nativePlants: string[];
  animalSpecies: string[];
  restorationProjects: string;
  expertOpinions: string;
  sources: string[];
  projectContributions: string;
  heroImage: string;
}

export interface EipComponentScore {
  name: string;
  weight: number; // percentage, e.g. 30
  score: number; // 0-100
  weightedScore: number;
  hasData: boolean;
  details: string;
  itemCount: number;
}

export interface EipEvaluationResult {
  totalScore: number; // 0-100
  effectiveWeight: number; // total available weight, e.g. 80 if 1 component missing
  normalizedScore: number; // normalized to 100 based on available data
  isComplete: boolean;
  statusText: string;
  statusColor: string;
  components: {
    plants: EipComponentScore;
    animals: EipComponentScore;
    environment: EipComponentScore;
    microhabitats: EipComponentScore;
  };
  missingComponents: string[];
  explanation: string;
  recommendations: string[];
}
