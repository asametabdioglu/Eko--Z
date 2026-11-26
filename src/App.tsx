/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation, NavTab } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { AddMeasurementView } from './components/measurements/AddMeasurementView';
import { MeasurementHistoryView } from './components/measurements/MeasurementHistoryView';
import { ObservationsView } from './components/observations/ObservationsView';
import { ResearchMapView } from './components/research/ResearchMapView';
import { ReportView } from './components/report/ReportView';
import { EipView } from './components/eip/EipView';
import { FirebaseSettingsModal } from './components/settings/FirebaseSettingsModal';
import { StorageService } from './services/storage';
import { Measurement, Observation, Microhabitat, RegionType } from './types';
import { Leaf, Award, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [microhabitats, setMicrohabitats] = useState<Microhabitat[]>([]);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load all data on mount
  const refreshData = () => {
    setMeasurements(StorageService.getMeasurements());
    setObservations(StorageService.getObservations());
    setMicrohabitats(StorageService.getMicrohabitats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Measurement Handlers
  const handleSaveMeasurement = (item: Omit<Measurement, 'id' | 'createdAt'>) => {
    const saved = StorageService.addMeasurement(item);
    refreshData();
    showNotification('Harika! Ölçüm başarıyla kaydedildi.');
  };

  const handleDeleteMeasurement = (id: string) => {
    StorageService.deleteMeasurement(id);
    refreshData();
    showNotification('Sensör ölçümü silindi.');
  };

  // Observation Handlers
  const handleAddObservation = (item: Omit<Observation, 'id' | 'createdAt'>) => {
    StorageService.addObservation(item);
    refreshData();
    showNotification('Canlı gözlemi başarıyla kaydedildi.');
  };

  const handleUpdateObservation = (id: string, updated: Partial<Observation>) => {
    StorageService.updateObservation(id, updated);
    refreshData();
    showNotification('Canlı gözlemi güncellendi.');
  };

  const handleDeleteObservation = (id: string) => {
    StorageService.deleteObservation(id);
    refreshData();
    showNotification('Canlı gözlemi silindi.');
  };

  // Microhabitat Handlers
  const handleAddMicrohabitat = (item: Omit<Microhabitat, 'id' | 'createdAt'>) => {
    StorageService.addMicrohabitat(item);
    refreshData();
    showNotification('Mikrohabitat alanı başarıyla kaydedildi.');
  };

  const handleDeleteMicrohabitat = (id: string) => {
    StorageService.deleteMicrohabitat(id);
    refreshData();
    showNotification('Mikrohabitat kaydı silindi.');
  };

  const isDemoMode = measurements.some(m => m.isDemo) || observations.some(o => o.isDemo);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF7] text-stone-800">
      
      {/* Global Navigation Header */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenDatabaseSettings={() => setIsDbModalOpen(true)}
        isDemoMode={isDemoMode}
        totalMeasurements={measurements.length}
      />

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className="bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-700 flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            measurements={measurements}
            observations={observations}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'add-measurement' && (
          <AddMeasurementView
            onSaveMeasurement={handleSaveMeasurement}
            onNavigateToHistory={() => setCurrentTab('history')}
          />
        )}

        {currentTab === 'history' && (
          <MeasurementHistoryView
            measurements={measurements}
            onDeleteMeasurement={handleDeleteMeasurement}
            onNavigateToAdd={() => setCurrentTab('add-measurement')}
          />
        )}

        {currentTab === 'observations' && (
          <ObservationsView
            observations={observations}
            onAddObservation={handleAddObservation}
            onUpdateObservation={handleUpdateObservation}
            onDeleteObservation={handleDeleteObservation}
          />
        )}

        {currentTab === 'research-map' && (
          <ResearchMapView />
        )}

        {currentTab === 'report' && (
          <ReportView
            measurements={measurements}
            observations={observations}
            microhabitats={microhabitats}
          />
        )}

        {currentTab === 'eip' && (
          <EipView
            measurements={measurements}
            observations={observations}
            microhabitats={microhabitats}
            onAddMicrohabitat={handleAddMicrohabitat}
            onDeleteMicrohabitat={handleDeleteMicrohabitat}
          />
        )}
      </main>

      {/* Database / Firebase Configuration Modal */}
      <FirebaseSettingsModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
        onDataChanged={refreshData}
        isDemoMode={isDemoMode}
        totalMeasurements={measurements.length}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Brand & Slogan */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-sm text-stone-900 font-sans">EKOİZ</span>
                <p className="text-xs text-stone-500 italic">
                  "Doğaya yeniden hayat ver, yaşamın izini sür."
                </p>
              </div>
            </div>

            {/* Quick footer navigation */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-stone-600">
              <button onClick={() => setCurrentTab('dashboard')} className="hover:text-emerald-800">
                Kontrol Paneli
              </button>
              <button onClick={() => setCurrentTab('add-measurement')} className="hover:text-emerald-800">
                Ölçüm Ekle
              </button>
              <button onClick={() => setCurrentTab('history')} className="hover:text-emerald-800">
                Ölçüm Geçmişi
              </button>
              <button onClick={() => setCurrentTab('observations')} className="hover:text-emerald-800">
                Canlı Gözlemleri
              </button>
              <button onClick={() => setCurrentTab('research-map')} className="hover:text-emerald-800">
                Araştırma Haritası
              </button>
              <button onClick={() => setCurrentTab('report')} className="hover:text-emerald-800">
                Gelişim Raporu
              </button>
              <button onClick={() => setCurrentTab('eip')} className="hover:text-emerald-800">
                EİP Puanı
              </button>
            </div>

            {/* FLL Challenge Info */}
            <div className="text-xs text-stone-400 text-center md:text-right">
              <div>FIRST LEGO League Challenge · BIOGLOW Sezonu</div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Afet Sonrası Ekosistem Takip & Biyoçeşitlilik İzleme Platformu
              </div>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
