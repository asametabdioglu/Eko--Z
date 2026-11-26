import React from 'react';
import { 
  Leaf, 
  LayoutDashboard, 
  PlusCircle, 
  LineChart, 
  Eye, 
  MapPin, 
  FileText, 
  Award, 
  Database,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export type NavTab = 
  | 'dashboard'
  | 'add-measurement'
  | 'history'
  | 'observations'
  | 'research-map'
  | 'report'
  | 'eip';

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenDatabaseSettings: () => void;
  isDemoMode: boolean;
  totalMeasurements: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenDatabaseSettings,
  isDemoMode,
  totalMeasurements
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; hint: string }[] = [
    { 
      id: 'dashboard', 
      label: 'Kontrol Paneli', 
      icon: <LayoutDashboard className="w-5 h-5" />, 
      hint: 'Genel bakış ve son veriler' 
    },
    { 
      id: 'add-measurement', 
      label: 'Ölçüm Ekle', 
      icon: <PlusCircle className="w-5 h-5 text-emerald-600" />, 
      hint: 'Arduino UNO değer girişi' 
    },
    { 
      id: 'history', 
      label: 'Ölçüm Geçmişi & Grafikler', 
      icon: <LineChart className="w-5 h-5" />, 
      hint: 'Sensör verileri ve analizler' 
    },
    { 
      id: 'observations', 
      label: 'Canlı Gözlem Merkezi', 
      icon: <Eye className="w-5 h-5" />, 
      hint: 'Bitki ve hayvan kayıtları' 
    },
    { 
      id: 'research-map', 
      label: 'Araştırma Haritası', 
      icon: <MapPin className="w-5 h-5" />, 
      hint: 'Hatay, Maraş, Adıyaman' 
    },
    { 
      id: 'report', 
      label: 'Gelişim Raporu', 
      icon: <FileText className="w-5 h-5" />, 
      hint: 'PDF raporu oluştur' 
    },
    { 
      id: 'eip', 
      label: 'İyileşme Puanı (EİP)', 
      icon: <Award className="w-5 h-5 text-amber-600" />, 
      hint: 'Deneysel ekosistem skoru' 
    }
  ];

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Bar for Desktop and Mobile Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Zone */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleTabClick('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-emerald-950 font-sans">EKOİZ</span>
                  <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    FLL BIOGLOW
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-stone-500 font-medium">
                  Doğaya yeniden hayat ver, yaşamın izini sür.
                </p>
              </div>
            </button>
          </div>

          {/* Quick status & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo / Live badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700">
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="hidden sm:inline">{isDemoMode ? 'Demo Verisi Aktif' : 'Canlı Veri'}</span>
              <span className="text-[10px] text-stone-400">({totalMeasurements})</span>
            </div>

            {/* Database / Settings button */}
            <button
              onClick={onOpenDatabaseSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors"
              title="Firebase / Veri Yönetimi"
            >
              <Database className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Veri & Firebase</span>
            </button>

            {/* Primary Action: Quick Add Measurement */}
            <button
              onClick={() => handleTabClick('add-measurement')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Ölçüm Ekle</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
              aria-label="Menüyü aç/kapat"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                  currentTab === item.id
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className={currentTab === item.id ? 'text-emerald-700' : 'text-stone-500'}>
                  {item.icon}
                </span>
                <div>
                  <div>{item.label}</div>
                  <div className="text-[11px] text-stone-400 font-normal">{item.hint}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Desktop Horizontal Sub-Navbar with clean icons and indicators */}
      <nav className="hidden lg:block bg-stone-50/90 border-b border-stone-200/80 backdrop-blur-sm sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-1.5 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  <span className={active ? 'text-emerald-200' : 'text-stone-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};
