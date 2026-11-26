import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEip } from './eipCalculator';
import { Measurement, Observation, Microhabitat } from '../types';

test('calculateEip returns 0 and marks all missing when no data provided', () => {
  const result = calculateEip([], [], []);
  assert.equal(result.normalizedScore, 0);
  assert.equal(result.effectiveWeight, 0);
  assert.equal(result.isComplete, false);
  assert.equal(result.missingComponents.length, 4);
});

test('calculateEip computes partial normalized score when some components have data', () => {
  const mockObservations: Observation[] = [
    {
      id: '1',
      category: 'plant',
      name: 'Defne',
      species: 'Laurus nobilis',
      region: 'Hatay',
      date: '2026-05-10',
      developmentStatus: 'Filizlendi',
      description: 'Yeni filizlendi',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      category: 'plant',
      name: 'Zeytin fidanı',
      species: 'Olea europaea',
      region: 'Hatay',
      date: '2026-05-12',
      developmentStatus: 'Gelişiyor',
      description: 'Gelişiyor',
      createdAt: new Date().toISOString()
    }
  ];

  const mockMeasurements: Measurement[] = [
    {
      id: 'm1',
      region: 'Hatay',
      locationName: 'Nokta 1',
      date: '2026-05-10',
      soilMoisture: 45,
      temperature: 22,
      airHumidity: 55,
      lightLevel: 650,
      studentTeam: 'Takım Bioglow',
      description: 'İyi koşullar',
      dataSource: 'Arduino UNO ile yapılan pilot ölçüm',
      createdAt: new Date().toISOString()
    }
  ];

  const result = calculateEip(mockMeasurements, mockObservations, []);
  assert.equal(result.components.plants.hasData, true);
  assert.equal(result.components.environment.hasData, true);
  assert.equal(result.components.animals.hasData, false);
  assert.equal(result.components.microhabitats.hasData, false);
  assert.equal(result.effectiveWeight, 50); // 30 + 20
  assert.ok(result.normalizedScore > 0);
  assert.equal(result.isComplete, false);
  assert.ok(result.missingComponents.includes('Hayvan ve Böcek Gözlemleri'));
  assert.ok(result.missingComponents.includes('Mikrohabitat Gözlemleri'));
});

test('calculateEip handles full data suite correctly', () => {
  const mockObservations: Observation[] = [
    {
      id: '1',
      category: 'plant',
      name: 'Kızılçam',
      species: 'Pinus brutia',
      region: 'Kahramanmaraş',
      date: '2026-05-10',
      developmentStatus: 'Filizlendi',
      description: 'Sağlıklı',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      category: 'animal',
      name: 'Bal arısı',
      species: 'Apis mellifera',
      region: 'Kahramanmaraş',
      date: '2026-05-10',
      animalCategory: 'Böcek',
      observationCount: 8,
      description: 'Çiçek tozlaştırma',
      createdAt: new Date().toISOString()
    }
  ];

  const mockMeasurements: Measurement[] = [
    {
      id: 'm1',
      region: 'Kahramanmaraş',
      locationName: 'Ahır Dağı Etekleri',
      date: '2026-05-10',
      soilMoisture: 50,
      temperature: 21,
      airHumidity: 58,
      lightLevel: 700,
      studentTeam: 'Robotik Takımı',
      description: 'Toprak nemi ve sıcaklık dengeli',
      dataSource: 'Arduino UNO ile yapılan pilot ölçüm',
      createdAt: new Date().toISOString()
    }
  ];

  const mockHabitats: Microhabitat[] = [
    {
      id: 'h1',
      region: 'Kahramanmaraş',
      habitatType: 'Nemli Taş Altı',
      date: '2026-05-10',
      description: 'Solucanlar ve böcek larvaları barınıyor'
    }
  ];

  const result = calculateEip(mockMeasurements, mockObservations, mockHabitats);
  assert.equal(result.isComplete, true);
  assert.equal(result.effectiveWeight, 100);
  assert.equal(result.missingComponents.length, 0);
  assert.ok(result.normalizedScore >= 30 && result.normalizedScore <= 100);
});
