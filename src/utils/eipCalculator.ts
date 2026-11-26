import { 
  Measurement, 
  Observation, 
  Microhabitat, 
  EipEvaluationResult, 
  EipComponentScore 
} from '../types';

/**
 * Calculates the experimental Ecosystem Recovery Score (Ekosistem İyileşme Puanı - EİP)
 * Components:
 * - Plant Observations (Bitki Gözlemleri): 30%
 * - Animal Observations (Hayvan Gözlemleri): 30%
 * - Soil & Environmental Conditions (Toprak ve Çevresel Koşullar): 20%
 * - Microhabitat Observations (Mikrohabitat Gözlemleri): 20%
 */
export function calculateEip(
  measurements: Measurement[],
  observations: Observation[],
  microhabitats: Microhabitat[],
  selectedRegion?: string
): EipEvaluationResult {
  // Filter by region if requested
  const regionMeasurements = selectedRegion && selectedRegion !== 'Tümü'
    ? measurements.filter(m => m.region === selectedRegion)
    : measurements;

  const regionObservations = selectedRegion && selectedRegion !== 'Tümü'
    ? observations.filter(o => o.region === selectedRegion)
    : observations;

  const regionMicrohabitats = selectedRegion && selectedRegion !== 'Tümü'
    ? microhabitats.filter(h => h.region === selectedRegion)
    : microhabitats;

  const plants = regionObservations.filter(o => o.category === 'plant');
  const animals = regionObservations.filter(o => o.category === 'animal');

  // 1. Bitki Gözlemleri (%30)
  const plantsComponent: EipComponentScore = {
    name: 'Bitki Gözlemleri',
    weight: 30,
    score: 0,
    weightedScore: 0,
    hasData: plants.length > 0,
    details: '',
    itemCount: plants.length
  };

  if (plants.length > 0) {
    // Unique species count
    const uniqueSpecies = new Set(plants.map(p => (p.species || p.name).toLowerCase().trim())).size;
    // Positive developmental states: Filizlendi, Gelişiyor, Çiçek açtı
    const thrivingPlants = plants.filter(p => 
      p.developmentStatus === 'Filizlendi' || 
      p.developmentStatus === 'Gelişiyor' || 
      p.developmentStatus === 'Çiçek açtı'
    ).length;
    const driedPlants = plants.filter(p => p.developmentStatus === 'Kurudu').length;

    // Diversity factor (up to 40 pts)
    const diversityPts = Math.min(40, uniqueSpecies * 8);
    // Vitality factor (up to 40 pts)
    const thrivingRatio = plants.length > 0 ? (thrivingPlants / plants.length) : 0;
    const vitalityPts = Math.round(thrivingRatio * 40);
    // Observation density bonus (up to 20 pts)
    const countPts = Math.min(20, plants.length * 4);
    // Penalty for dead ratio
    const driedPenalty = (driedPlants / plants.length) * 15;

    const rawScore = Math.max(10, Math.min(100, Math.round(diversityPts + vitalityPts + countPts - driedPenalty)));
    plantsComponent.score = rawScore;
    plantsComponent.weightedScore = Number(((rawScore * 30) / 100).toFixed(1));
    plantsComponent.details = `${plants.length} kayıt, ${uniqueSpecies} farklı tür (${thrivingPlants} tanesi gelişme/çiçeklenme evresinde).`;
  } else {
    plantsComponent.details = 'Henüz bitki gözlem kaydı bulunmuyor.';
  }

  // 2. Hayvan Gözlemleri (%30)
  const animalsComponent: EipComponentScore = {
    name: 'Hayvan ve Böcek Gözlemleri',
    weight: 30,
    score: 0,
    weightedScore: 0,
    hasData: animals.length > 0,
    details: '',
    itemCount: animals.length
  };

  if (animals.length > 0) {
    const uniqueClasses = new Set(animals.map(a => a.animalCategory || 'Diğer')).size;
    const uniqueSpecies = new Set(animals.map(a => (a.species || a.name).toLowerCase().trim())).size;
    const totalCount = animals.reduce((acc, curr) => acc + (curr.observationCount || 1), 0);

    // Class diversity (Kuş, Böcek, Memeli, vb. - up to 45 pts)
    const classDiversityPts = Math.min(45, uniqueClasses * 15);
    // Species diversity (up to 35 pts)
    const speciesPts = Math.min(35, uniqueSpecies * 7);
    // Population frequency (up to 20 pts)
    const popPts = Math.min(20, Math.round(Math.log2(totalCount + 1) * 5));

    const rawScore = Math.min(100, Math.max(10, Math.round(classDiversityPts + speciesPts + popPts)));
    animalsComponent.score = rawScore;
    animalsComponent.weightedScore = Number(((rawScore * 30) / 100).toFixed(1));
    animalsComponent.details = `${animals.length} kayıt (${totalCount} birey), ${uniqueClasses} farklı canlı sınıfı (Kuş, böcek, tozlaştırıcı vb.).`;
  } else {
    animalsComponent.details = 'Henüz hayvan/böcek gözlem kaydı bulunmuyor.';
  }

  // 3. Toprak ve Çevresel Koşullar (%20)
  const envComponent: EipComponentScore = {
    name: 'Toprak ve Çevresel Koşullar',
    weight: 20,
    score: 0,
    weightedScore: 0,
    hasData: regionMeasurements.length > 0,
    details: '',
    itemCount: regionMeasurements.length
  };

  if (regionMeasurements.length > 0) {
    // Evaluate whether measured values fall within biological recovery comfort bands
    // Soil moisture: 30% - 70% is optimal
    // Temperature: 15°C - 30°C is optimal
    // Air humidity: 40% - 80% is optimal
    let totalQuality = 0;
    regionMeasurements.forEach(m => {
      let measurementQuality = 0;
      // Moisture (max 40 pts)
      if (m.soilMoisture >= 30 && m.soilMoisture <= 70) {
        measurementQuality += 40;
      } else if (m.soilMoisture >= 15 && m.soilMoisture <= 85) {
        measurementQuality += 25;
      } else {
        measurementQuality += 10;
      }

      // Temperature (max 35 pts)
      if (m.temperature >= 16 && m.temperature <= 28) {
        measurementQuality += 35;
      } else if (m.temperature >= 10 && m.temperature <= 35) {
        measurementQuality += 22;
      } else {
        measurementQuality += 10;
      }

      // Air Humidity (max 25 pts)
      if (m.airHumidity >= 40 && m.airHumidity <= 75) {
        measurementQuality += 25;
      } else if (m.airHumidity >= 25 && m.airHumidity <= 90) {
        measurementQuality += 15;
      } else {
        measurementQuality += 8;
      }

      totalQuality += measurementQuality;
    });

    const avgQuality = Math.round(totalQuality / regionMeasurements.length);
    const rawScore = Math.min(100, Math.max(15, avgQuality));
    envComponent.score = rawScore;
    envComponent.weightedScore = Number(((rawScore * 20) / 100).toFixed(1));

    const avgSoil = Math.round(regionMeasurements.reduce((s, m) => s + m.soilMoisture, 0) / regionMeasurements.length);
    const avgTemp = Math.round(regionMeasurements.reduce((s, m) => s + m.temperature, 0) / regionMeasurements.length);
    envComponent.details = `${regionMeasurements.length} ölçüm ortalaması: Toprak Nemi %${avgSoil}, Sıcaklık ${avgTemp}°C.`;
  } else {
    envComponent.details = 'Henüz sensör ölçüm kaydı bulunmuyor.';
  }

  // 4. Mikrohabitat Gözlemleri (%20)
  const microComponent: EipComponentScore = {
    name: 'Mikrohabitat Gözlemleri',
    weight: 20,
    score: 0,
    weightedScore: 0,
    hasData: regionMicrohabitats.length > 0,
    details: '',
    itemCount: regionMicrohabitats.length
  };

  if (regionMicrohabitats.length > 0) {
    const uniqueTypes = new Set(regionMicrohabitats.map(h => h.habitatType.toLowerCase().trim())).size;
    // Microhabitat score: diversity and count
    const diversityPts = Math.min(60, uniqueTypes * 20);
    const countPts = Math.min(40, regionMicrohabitats.length * 15);
    const rawScore = Math.min(100, Math.max(20, diversityPts + countPts));

    microComponent.score = rawScore;
    microComponent.weightedScore = Number(((rawScore * 20) / 100).toFixed(1));
    microComponent.details = `${regionMicrohabitats.length} kayıt, ${uniqueTypes} farklı mikrohabitat tipi (ör. taş altı, ağaç kovuğu, çalı kümesi).`;
  } else {
    microComponent.details = 'Henüz mikrohabitat gözlem kaydı bulunmuyor.';
  }

  const allComponents = [plantsComponent, animalsComponent, envComponent, microComponent];
  const missingComponents: string[] = [];

  let effectiveWeight = 0;
  let rawWeightedSum = 0;

  allComponents.forEach(c => {
    if (c.hasData) {
      effectiveWeight += c.weight;
      rawWeightedSum += c.weightedScore;
    } else {
      missingComponents.push(c.name);
    }
  });

  const isComplete = missingComponents.length === 0;
  // If effectiveWeight is 0 (no data at all), normalizedScore is 0
  const normalizedScore = effectiveWeight > 0 
    ? Math.round((rawWeightedSum / effectiveWeight) * 100) 
    : 0;

  let statusText = 'Veri Yetersiz';
  let statusColor = 'text-stone-500';

  if (effectiveWeight > 0) {
    if (normalizedScore >= 75) {
      statusText = 'Yüksek İyileşme Potansiyeli';
      statusColor = 'text-emerald-700';
    } else if (normalizedScore >= 50) {
      statusText = 'Orta Düzey İyileşme Süreci';
      statusColor = 'text-green-700';
    } else if (normalizedScore >= 30) {
      statusText = 'Erken Başlangıç Aşaması';
      statusColor = 'text-amber-700';
    } else {
      statusText = 'Düşük İyileşme Göstergesi';
      statusColor = 'text-orange-700';
    }
  }

  const recommendations: string[] = [];
  if (!plantsComponent.hasData) recommendations.push('Bölgedeki yerel bitkiler ve filizlenen fidanlar için yeni bitki gözlemi ekleyin.');
  if (!animalsComponent.hasData) recommendations.push('Bölgedeki kuş, böcek ve tozlaştırıcı canlı gözlemlerini sisteme kaydedin.');
  if (!envComponent.hasData) recommendations.push('Arduino UNO sensör ölçümleri (toprak nemi, sıcaklık, ışık) girerek çevresel koşulları izleyin.');
  if (!microComponent.hasData) recommendations.push('Canlılara sığınak oluşturan mikrohabitatları (kaya altları, çürümüş kütükler, çalı altları) belgeleyin.');
  if (recommendations.length === 0) {
    recommendations.push('Harika! Tüm bileşenlerde veri kaydı mevcut. Periyodik haftalık ölçümlerle değişimi izlemeye devam edin.');
  }

  const explanation = isComplete
    ? `Hesaplama 4 ana bileşenin tümü (%30 Bitki, %30 Hayvan, %20 Çevresel Koşul, %20 Mikrohabitat) kullanılarak yapılmıştır.`
    : effectiveWeight > 0
      ? `Eksik veri bulunmaktadır. Mevcut puan yalnızca verisi girilen %${effectiveWeight}'lik bileşenler üzerinden orantılanmıştır (${missingComponents.join(', ')} henüz girilmedi).`
      : 'Hesaplama yapabilmek için lütfen en az bir gözlem veya sensör ölçümü ekleyin.';

  return {
    totalScore: Number(rawWeightedSum.toFixed(1)),
    effectiveWeight,
    normalizedScore,
    isComplete,
    statusText,
    statusColor,
    components: {
      plants: plantsComponent,
      animals: animalsComponent,
      environment: envComponent,
      microhabitats: microComponent
    },
    missingComponents,
    explanation,
    recommendations
  };
}
