import React, { useState } from 'react';
import { 
  Database, 
  Cloud, 
  HardDrive, 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Code2,
  Info
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface FirebaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
  isDemoMode: boolean;
  totalMeasurements: number;
}

export const FirebaseSettingsModal: React.FC<FirebaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
  isDemoMode,
  totalMeasurements
}) => {
  const [apiKey, setApiKey] = useState('');
  const [projectId, setProjectId] = useState('');
  const [authDomain, setAuthDomain] = useState('');
  const [storageBucket, setStorageBucket] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleResetDemo = () => {
    if (confirm('Tüm veriler başlangıçtaki örnek demo verilerine sıfırlansın mı?')) {
      StorageService.resetToDemo();
      onDataChanged();
      setStatusMsg({ type: 'success', text: 'Örnek demo verileri başarıyla geri yüklendi.' });
    }
  };

  const handleClearAll = () => {
    if (confirm('Tüm ölçüm ve gözlem kayıtlarını silmek istediğinizden emin misiniz?')) {
      StorageService.clearAllData();
      onDataChanged();
      setStatusMsg({ type: 'success', text: 'Tüm veriler temizlendi. Şimdi kendi canlı verilerinizi girebilirsiniz.' });
    }
  };

  const handleExportJson = () => {
    const jsonStr = StorageService.exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EKOIZ_Veri_Yedegi_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMsg({ type: 'success', text: 'JSON veri yedeği indirildi.' });
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const result = StorageService.importDataJson(reader.result);
        if (result.success) {
          onDataChanged();
          setStatusMsg({ type: 'success', text: result.message + ` (${result.count} kayıt)` });
        } else {
          setStatusMsg({ type: 'error', text: result.message });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId.trim()) {
      setStatusMsg({ type: 'error', text: 'Lütfen en azından bir Firebase Project ID girin.' });
      return;
    }

    localStorage.setItem('ekoiz_firebase_custom_config', JSON.stringify({
      apiKey,
      projectId,
      authDomain,
      storageBucket,
      configuredAt: new Date().toISOString()
    }));

    setStatusMsg({ 
      type: 'success', 
      text: 'Firebase yapılandırması kaydedildi. Bulut Firestore eşitlemesi hazır.' 
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl border border-stone-200 my-8">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Veritabanı ve Firebase Yönetimi
              </h2>
              <p className="text-xs text-stone-500">
                Veri depolama modu, Firebase Firestore entegrasyonu ve yedekleme
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Current Active Mode Status Card */}
        <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HardDrive className="w-5 h-5 text-emerald-700" />
            <div>
              <div className="text-xs font-bold text-stone-900">
                {isDemoMode ? 'Demo & Yerel Tarayıcı Depolama (Aktif)' : 'Canlı Veritabanı Modu'}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Verileriniz tarayıcınızın yerel belleğinde güvenle saklanır, internet olmadan da çalışır.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md">
            {totalMeasurements} Ölçüm
          </span>
        </div>

        {/* Firebase Firestore Connection Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Cloud className="w-4 h-4 text-emerald-700" />
              <span>Firebase Firestore Yapılandırma Alanları</span>
            </h3>
            <span className="text-[10px] text-stone-400">İsteğe Bağlı Bulut Kaydı</span>
          </div>

          <form onSubmit={handleSaveFirebaseConfig} className="space-y-3 text-xs bg-stone-50/70 p-4 rounded-xl border border-stone-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Firebase Project ID</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="ekoiz-fll-project"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 bg-white outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-600 mb-1">API Key</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 bg-white outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  placeholder="ekoiz-fll-project.firebaseapp.com"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 bg-white outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-600 mb-1">Storage Bucket</label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  placeholder="ekoiz-fll-project.appspot.com"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-stone-800 bg-white outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg transition-colors"
              >
                Yapılandırmayı Kaydet
              </button>
            </div>
          </form>
        </div>

        {/* Backup & Demo Reset Actions */}
        <div className="space-y-3 pt-2 border-t border-stone-200">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Öğrenci Takımı Veri Yedekleme ve Yönetim
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleExportJson}
              className="p-3 rounded-xl border border-stone-200 hover:bg-stone-50 flex flex-col items-center text-center gap-1.5 transition-colors text-stone-700"
            >
              <Download className="w-4 h-4 text-emerald-700" />
              <span className="text-[11px] font-semibold">Yedek İndir (JSON)</span>
            </button>

            <label className="p-3 rounded-xl border border-stone-200 hover:bg-stone-50 flex flex-col items-center text-center gap-1.5 transition-colors text-stone-700 cursor-pointer">
              <Upload className="w-4 h-4 text-emerald-700" />
              <span className="text-[11px] font-semibold">Yedek Yükle</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetDemo}
              className="p-3 rounded-xl border border-stone-200 hover:bg-amber-50 flex flex-col items-center text-center gap-1.5 transition-colors text-amber-800"
            >
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span className="text-[11px] font-semibold">Demo Verisi Yükle</span>
            </button>

            <button
              onClick={handleClearAll}
              className="p-3 rounded-xl border border-stone-200 hover:bg-red-50 flex flex-col items-center text-center gap-1.5 transition-colors text-red-700"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span className="text-[11px] font-semibold">Verileri Temizle</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
