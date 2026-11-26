import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  PlusCircle, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Terminal, 
  Droplets, 
  Thermometer, 
  CloudRain, 
  SunMedium, 
  MapPin, 
  Users, 
  FileEdit,
  ArrowRight
} from 'lucide-react';
import { Measurement, RegionType, DataSourceType } from '../../types';

interface AddMeasurementViewProps {
  onSaveMeasurement: (measurement: Omit<Measurement, 'id' | 'createdAt'>) => void;
  onNavigateToHistory: () => void;
}

export const AddMeasurementView: React.FC<AddMeasurementViewProps> = ({
  onSaveMeasurement,
  onNavigateToHistory
}) => {
  // Current local datetime string for default value (YYYY-MM-DDTHH:mm)
  const now = new Date();
  const defaultDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [region, setRegion] = useState<RegionType>('Okul Pilot Alanı');
  const [locationName, setLocationName] = useState('');
  const [date, setDate] = useState(defaultDateTime);
  const [soilMoisture, setSoilMoisture] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [airHumidity, setAirHumidity] = useState<string>('');
  const [lightLevel, setLightLevel] = useState<string>('');
  const [studentTeam, setStudentTeam] = useState('');
  const [description, setDescription] = useState('');
  const [dataSource, setDataSource] = useState<DataSourceType>('Arduino UNO ile yapılan pilot ölçüm');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showArduinoGuide, setShowArduinoGuide] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!locationName.trim()) {
      newErrors.locationName = 'Lütfen ölçüm noktasının adını girin (Örn: Fidanlık Parsel A-1)';
    }

    if (!date) {
      newErrors.date = 'Lütfen geçerli bir ölçüm tarihi ve saati seçin';
    }

    // Soil moisture: 0 - 100%
    const soilVal = parseFloat(soilMoisture);
    if (soilMoisture.trim() === '' || isNaN(soilVal)) {
      newErrors.soilMoisture = 'Toprak nemi alanına geçerli bir sayı girin (0 - 100 arası)';
    } else if (soilVal < 0 || soilVal > 100) {
      newErrors.soilMoisture = 'Toprak nemi %0 ile %100 arasında olmalıdır';
    }

    // Temperature: -20 to 60 °C
    const tempVal = parseFloat(temperature);
    if (temperature.trim() === '' || isNaN(tempVal)) {
      newErrors.temperature = 'Sıcaklık alanına sayısal bir derece değeri girin (Örn: 23.5)';
    } else if (tempVal < -30 || tempVal > 65) {
      newErrors.temperature = 'Sıcaklık değeri mantıklı bir aralıkta olmalıdır (-30°C ile 65°C)';
    }

    // Air Humidity: 0 - 100%
    const airVal = parseFloat(airHumidity);
    if (airHumidity.trim() === '' || isNaN(airVal)) {
      newErrors.airHumidity = 'Hava nemi alanına geçerli bir sayı girin (0 - 100 arası)';
    } else if (airVal < 0 || airVal > 100) {
      newErrors.airHumidity = 'Hava nemi %0 ile %100 arasında olmalıdır';
    }

    // Light level: 0 - 1023 (analog sensor reading)
    const lightVal = parseFloat(lightLevel);
    if (lightLevel.trim() === '' || isNaN(lightVal)) {
      newErrors.lightLevel = 'Işık seviyesi değerini girin (Arduino analog pin değeri: 0 - 1023)';
    } else if (lightVal < 0 || lightVal > 1023) {
      newErrors.lightLevel = 'Arduino analog okuması 0 ile 1023 arasında olmalıdır';
    }

    if (!studentTeam.trim()) {
      newErrors.studentTeam = 'Lütfen ölçümü yapan öğrenci adı veya takım adını girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const payload: Omit<Measurement, 'id' | 'createdAt'> = {
      region,
      locationName: locationName.trim(),
      date,
      soilMoisture: Number(parseFloat(soilMoisture).toFixed(1)),
      temperature: Number(parseFloat(temperature).toFixed(1)),
      airHumidity: Number(parseFloat(airHumidity).toFixed(1)),
      lightLevel: Math.round(parseFloat(lightLevel)),
      studentTeam: studentTeam.trim(),
      description: description.trim(),
      dataSource
    };

    onSaveMeasurement(payload);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#22C55E', '#14532D', '#A16207']
      });
    } catch {
      // safe fallback
    }

    setSuccessMessage('Harika! Ölçüm başarıyla kaydedildi.');

    // Clear form inputs but keep region and team for next measurement convenience
    setLocationName('');
    setSoilMoisture('');
    setTemperature('');
    setAirHumidity('');
    setLightLevel('');
    setDescription('');
    setErrors({});

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper function to fill sample Arduino values into the form for quick testing
  const fillSampleArduinoReading = () => {
    setLocationName('Okul Bahçesi Test Noktası');
    setSoilMoisture('52');
    setTemperature('23.4');
    setAirHumidity('61');
    setLightLevel('785');
    setStudentTeam('Bioglow Sensör Ekibi');
    setDescription('Arduino UNO A0 pininden okunan toprak nemi ve DHT11 ortam sensörü verileri.');
    setErrors({});
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Title & Introduction */}
      <div>
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-1">
          <Cpu className="w-4 h-4 text-emerald-600" />
          <span>Manuel Arduino UNO Veri Kayıt Portalı</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Sensör Ölçümü Ekle
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          Arduino UNO kartınızdaki sensörlerden elde edilen değerleri Arduino IDE Seri Port Ekranı'ndan okuyarak aşağıdaki forma giriniz.
        </p>
      </div>

      {/* Arduino IDE Serial Monitor Guide Banner */}
      <div className="bg-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 font-mono text-sm">
              &gt;_
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Arduino IDE Seri Monitör Ekranı Nasıl Okunur?
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Bilgisayarınızda <code>Araçlar &gt; Seri Port Ekranı</code> (Ctrl+Shift+M) menüsünü açın.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowArduinoGuide(!showArduinoGuide)}
              className="text-xs px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors"
            >
              {showArduinoGuide ? 'Rehberi Gizle' : 'Örnek Kodu ve Çıktıyı Göster'}
            </button>
            <button
              type="button"
              onClick={fillSampleArduinoReading}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium transition-colors"
            >
              Örnek Değerleri Doldur
            </button>
          </div>
        </div>

        {showArduinoGuide && (
          <div className="mt-4 pt-4 border-t border-stone-800 space-y-3 text-xs font-mono">
            <p className="text-stone-300">
              Sensörlerinizin Arduino UNO pinleri: Toprak Nemi (A0 analog pin), DHT11 Sıcaklık & Hava Nemi (D2 dijital pin), LDR Işık Sensörü (A1 analog pin).
            </p>
            <div className="bg-black/70 p-3 rounded-lg border border-stone-800 text-emerald-400">
              <div>[EKOIZ - Arduino UNO Seri Port Ciktisi (9600 baud)]</div>
              <div className="text-stone-300">Toprak Nemi: %48.5 | Sicaklik: 22.0 C | Hava Nemi: %55.0 | Isik: 740</div>
              <div className="text-stone-300">Toprak Nemi: %49.0 | Sicaklik: 22.1 C | Hava Nemi: %55.2 | Isik: 742</div>
            </div>
            <p className="text-stone-400 text-[11px]">
              * Not: Uygulama öğrencilerin güvenliği ve sadeliği için Arduino ile doğrudan otomatik kablo bağlantısı yapmaz; değerler öğrenciler tarafından elle girilir.
            </p>
          </div>
        )}
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-start justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-950">{successMessage}</p>
              <p className="text-xs text-emerald-800 mt-0.5">
                Ölçüm geçmişi tablosuna ve grafiklerine anında yansıtıldı.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateToHistory}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors flex items-center gap-1"
            >
              <span>Geçmişi İncele</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-stone-400 hover:text-stone-600 text-sm font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Measurement Input Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        
        {/* Section 1: Location & Context */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <span>1. Konum ve Ölçüm Bilgileri</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Region Selection */}
            <div>
              <label htmlFor="measurement-region" className="block text-xs font-semibold text-stone-700 mb-1">
                Ölçüm Yapılan Bölge *
              </label>
              <select
                id="measurement-region"
                value={region}
                onChange={(e) => setRegion(e.target.value as RegionType)}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
              >
                <option value="Hatay">Hatay</option>
                <option value="Kahramanmaraş">Kahramanmaraş</option>
                <option value="Adıyaman">Adıyaman</option>
                <option value="Okul Pilot Alanı">Okul Pilot Alanı</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            {/* Location Name */}
            <div>
              <label htmlFor="measurement-location" className="block text-xs font-semibold text-stone-700 mb-1">
                Ölçüm Noktası Adı *
              </label>
              <input
                id="measurement-location"
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Örn: Fidanlık Parsel B, Gölet Kenarı, Saksı 3"
                className={`w-full px-3 py-2.5 rounded-lg border text-sm text-stone-800 outline-none transition-colors ${
                  errors.locationName 
                    ? 'border-red-400 bg-red-50/30 focus:ring-2 focus:ring-red-400' 
                    : 'border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600'
                }`}
              />
              {errors.locationName && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.locationName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Measurement Date & Time */}
            <div>
              <label htmlFor="measurement-date" className="block text-xs font-semibold text-stone-700 mb-1">
                Ölçüm Tarihi ve Saati *
              </label>
              <input
                id="measurement-date"
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm text-stone-800 outline-none ${
                  errors.date ? 'border-red-400 bg-red-50/30' : 'border-stone-300 focus:ring-2 focus:ring-emerald-600'
                }`}
              />
              {errors.date && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.date}
                </p>
              )}
            </div>

            {/* Data Source Type */}
            <div>
              <label htmlFor="measurement-source" className="block text-xs font-semibold text-stone-700 mb-1">
                Veri Kaynağı *
              </label>
              <select
                id="measurement-source"
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value as DataSourceType)}
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-stone-800 text-sm focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                <option value="Arduino UNO ile yapılan pilot ölçüm">
                  Arduino UNO ile yapılan pilot ölçüm
                </option>
                <option value="Manuel gözlem veya araştırma verisi">
                  Manuel gözlem veya araştırma verisi
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Sensor Values Read from Serial Monitor */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Cpu className="w-4 h-4 text-emerald-700" />
            <span>2. Sensör Değerleri (Seri Monitörden Okunanlar)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Toprak Nemi (%) */}
            <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/80">
              <label htmlFor="sensor-soil" className="block text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-emerald-600" />
                <span>Toprak Nemi (%) *</span>
              </label>
              <input
                id="sensor-soil"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={soilMoisture}
                onChange={(e) => setSoilMoisture(e.target.value)}
                placeholder="Örn: 48.5"
                className={`w-full px-3 py-2 rounded-lg border text-sm bg-white text-stone-900 outline-none ${
                  errors.soilMoisture ? 'border-red-400 bg-red-50' : 'border-stone-300 focus:ring-2 focus:ring-emerald-600'
                }`}
              />
              <span className="block text-[11px] text-stone-500 mt-1">İdeal aralık: %30 - %70</span>
              {errors.soilMoisture && (
                <p className="text-[11px] text-red-600 mt-1">{errors.soilMoisture}</p>
              )}
            </div>

            {/* Sıcaklık (°C) */}
            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80">
              <label htmlFor="sensor-temp" className="block text-xs font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-600" />
                <span>Sıcaklık (°C) *</span>
              </label>
              <input
                id="sensor-temp"
                type="number"
                step="0.1"
                min="-20"
                max="60"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="Örn: 22.4"
                className={`w-full px-3 py-2 rounded-lg border text-sm bg-white text-stone-900 outline-none ${
                  errors.temperature ? 'border-red-400 bg-red-50' : 'border-stone-300 focus:ring-2 focus:ring-amber-600'
                }`}
              />
              <span className="block text-[11px] text-stone-500 mt-1">DHT11 / Termistör</span>
              {errors.temperature && (
                <p className="text-[11px] text-red-600 mt-1">{errors.temperature}</p>
              )}
            </div>

            {/* Hava Nemi (%) */}
            <div className="p-4 rounded-xl bg-cyan-50/40 border border-cyan-200/80">
              <label htmlFor="sensor-air" className="block text-xs font-bold text-cyan-950 mb-1 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-cyan-600" />
                <span>Hava Nemi (%) *</span>
              </label>
              <input
                id="sensor-air"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={airHumidity}
                onChange={(e) => setAirHumidity(e.target.value)}
                placeholder="Örn: 58.0"
                className={`w-full px-3 py-2 rounded-lg border text-sm bg-white text-stone-900 outline-none ${
                  errors.airHumidity ? 'border-red-400 bg-red-50' : 'border-stone-300 focus:ring-2 focus:ring-cyan-600'
                }`}
              />
              <span className="block text-[11px] text-stone-500 mt-1">DHT11 / DHT22 bağıl nem</span>
              {errors.airHumidity && (
                <p className="text-[11px] text-red-600 mt-1">{errors.airHumidity}</p>
              )}
            </div>

            {/* Işık Seviyesi (0-1023) */}
            <div className="p-4 rounded-xl bg-yellow-50/40 border border-yellow-200/80">
              <label htmlFor="sensor-light" className="block text-xs font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                <SunMedium className="w-4 h-4 text-yellow-600" />
                <span>Işık Seviyesi (0-1023) *</span>
              </label>
              <input
                id="sensor-light"
                type="number"
                step="1"
                min="0"
                max="1023"
                value={lightLevel}
                onChange={(e) => setLightLevel(e.target.value)}
                placeholder="Örn: 750"
                className={`w-full px-3 py-2 rounded-lg border text-sm bg-white text-stone-900 outline-none ${
                  errors.lightLevel ? 'border-red-400 bg-red-50' : 'border-stone-300 focus:ring-2 focus:ring-yellow-600'
                }`}
              />
              <span className="block text-[11px] text-stone-500 mt-1">LDR sensörü analog okuma</span>
              {errors.lightLevel && (
                <p className="text-[11px] text-red-600 mt-1">{errors.lightLevel}</p>
              )}
            </div>

          </div>
        </div>

        {/* Section 3: Team & Notes */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>3. Ekip ve Gözlem Notları</span>
          </h3>

          <div>
            <label htmlFor="team-name" className="block text-xs font-semibold text-stone-700 mb-1">
              Ölçümü Yapan Öğrenci veya Ekip *
            </label>
            <input
              id="team-name"
              type="text"
              value={studentTeam}
              onChange={(e) => setStudentTeam(e.target.value)}
              placeholder="Örn: Ayşe Demir & EKOİZ Takımı, Sensör Grubu"
              className={`w-full px-3 py-2.5 rounded-lg border text-sm text-stone-800 outline-none ${
                errors.studentTeam ? 'border-red-400 bg-red-50/30' : 'border-stone-300 focus:ring-2 focus:ring-emerald-600'
              }`}
            />
            {errors.studentTeam && (
              <p className="text-xs text-red-600 mt-1">{errors.studentTeam}</p>
            )}
          </div>

          <div>
            <label htmlFor="measurement-desc" className="block text-xs font-semibold text-stone-700 mb-1">
              Açıklama ve Çevre Koşulları
            </label>
            <textarea
              id="measurement-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Hava durumu nasıldı? Toprak rengi ve kokusu nasıldı? Fidanların durumu ve çevre gözlemlerinizi yazabilirsiniz."
              className="w-full px-3 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Big Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 hover:to-green-800 text-white font-bold text-base sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>ÖLÇÜMÜ KAYDET</span>
          </button>
          <p className="text-center text-xs text-stone-500 mt-2">
            Kaydedilen veriler yerel veritabanında ve seçilmişse Firebase Firestore üzerinde güvenle saklanır.
          </p>
        </div>

      </form>
    </div>
  );
};
