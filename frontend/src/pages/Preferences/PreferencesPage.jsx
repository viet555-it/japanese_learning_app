import React, { useState } from 'react';
import { usePreferences } from '../../context/PreferenceContext';
import { Settings, Image, Palette, Type, MousePointer2, Music, UploadCloud, CheckCircle2, User, ChevronUp, Wand2, Volume2, VolumeX, Speaker } from 'lucide-react';

const BASE_THEMES = [
  { id: 'light', name: 'light', color: '#f5f5f5', text: '#111111' },
  { id: 'dark', name: 'dark', color: '#111111', text: '#ffffff' }
];

const DARK_THEMES = [
  { id: 'sapphire-bloom', name: 'sapphire bloom', color: '#080d1c', text: '#cbe6ff' },
  { id: 'monkeytype', name: 'monkeytype', color: '#323437', text: '#e2b714' },
  { id: 'temple-mist', name: 'temple mist', color: '#0d1717', text: '#8ce1d5' },
  { id: 'moonlit-bay', name: 'moonlit bay', color: '#0f1626', text: '#abcbff' },
  { id: 'emerald-forest', name: 'emerald forest', color: '#0d1b10', text: '#a7f3d0' },
  { id: 'shrine-stone', name: 'shrine stone', color: '#1a1818', text: '#d97c62' },
  { id: 'sakura-pink', name: 'sakura pink', color: '#fce4ec', text: '#880e4f' },
  { id: 'vending-glow', name: 'vending glow', color: '#14051a', text: '#eb77ff' },
];

const FONTS = [
  { id: 'font-sans', name: 'Inter' },
  { id: 'font-zen', name: 'Zen Maru Gothic' },
  { id: 'font-kiwi', name: 'Kiwi Maru' },
  { id: 'font-dot', name: 'DotGothic16' }
];

const STICKERS = [
  { id: 'none', icon: '∅', name: 'None' },
  { id: 'sakura', icon: '🌸', name: 'Sakura' },
  { id: 'bamboo', icon: '🎋', name: 'Bamboo' },
  { id: 'lantern', icon: '🏮', name: 'Lantern' },
  { id: 'sushi', icon: '🍣', name: 'Sushi' },
  { id: 'onigiri', icon: '🍙', name: 'Onigiri' },
  { id: 'sparkles', icon: '✨', name: 'Sparkles' }
];

const BG_PRESETS = [
  { id: 'none', name: 'Solid Theme', url: 'none' },
  { id: 'tokyo', name: 'Tokyo Neon', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop' },
  { id: 'fuji', name: 'Mt. Fuji', url: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?q=80&w=2000&auto=format&fit=crop' },
  { id: 'shrine', name: 'Kyoto Shrine', url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2000&auto=format&fit=crop' },
];

const BGMS = [
  { id: 'none', name: 'Muted' },
  { id: 'study_lofi', name: 'Study Lofi' },
  { id: 'tokyo_night', name: 'Tokyo Night' },
  { id: 'zen_garden', name: 'Zen Garden' }
];

export default function PreferencesPage() {
  const { preferences, updatePreference } = usePreferences();
  const [activeTab, setActiveTab] = useState('display');
  const [bgInput, setBgInput] = useState('');

  const handleBgSubmit = (e) => {
    e.preventDefault();
    if (bgInput.trim()) {
      updatePreference('background', bgInput);
      setBgInput('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
         alert("File is too large! Please select an image under 5MB to ensure it saves properly.");
         return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePreference('background', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThemeSelect = (themeId) => {
    updatePreference('theme', themeId);
    updatePreference('background', 'none'); 
  };

  const hasBg = preferences.background !== 'none';
  const glassPanel = hasBg ? 'bg-black/70 backdrop-blur-[24px] border border-white/10 p-6 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : '';
  const glassHeader = hasBg ? 'bg-black/70 backdrop-blur-[24px] border border-white/10 p-4 px-6 rounded-[2rem] shadow-xl' : '';

  return (
    <div className="w-full max-w-[1200px] px-4 md:px-8 lg:px-16 py-6 md:py-10 pb-40 min-h-screen text-[var(--text-color)] font-sans">
      
      {/* Header & Tabs Area */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 ${glassHeader}`}>
         {/* Title */}
         <div className="flex items-center gap-4 text-3xl font-black tracking-tight" style={{ color: 'var(--text-color)' }}>
            <Wand2 size={32} className="opacity-80" />
            Preferences
         </div>

         {/* Tabs Container */}
         <div className="flex bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-full p-2 h-[52px] shadow-sm">
            <button 
              onClick={() => setActiveTab('display')} 
              className={`flex-1 min-w-[120px] rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all ${activeTab === 'display' ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-md' : 'text-[var(--text-color)] opacity-60 hover:opacity-100'}`}
            >
              <Palette size={16} /> Display
            </button>
            <button 
              onClick={() => setActiveTab('effects')} 
              className={`flex-1 min-w-[120px] rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all ${activeTab === 'effects' ? 'bg-[var(--accent-color)] text-[var(--bg-color)] shadow-md' : 'text-[var(--text-color)] opacity-60 hover:opacity-100'}`}
            >
              <Wand2 size={16} /> Effects
            </button>
         </div>
      </div>

      <div className="space-y-12">

        {/* ======================================================== */}
        {/* DISPLAY TAB */}
        {/* ======================================================== */}
        {activeTab === 'display' && (
          <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${glassPanel}`}>
             
             {/* Sub: Custom Wallpaper */}
             <div className="mb-14">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-10 h-14 bg-[rgba(255,255,255,0.05)] rounded-r-xl flex items-center justify-center">
                   <div className="w-1.5 h-6 bg-[var(--text-color)] opacity-30 rounded-full" />
                 </div>
                 <ChevronUp size={22} className="opacity-50" />
                 <Image size={24} className="opacity-70" />
                 <span className="text-2xl font-bold tracking-wide">Wallpaper</span>
               </div>
               <div className="pl-6 lg:pl-[100px]">
                  
                  {/* Presets Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                     {BG_PRESETS.map(bg => (
                       <button
                         key={bg.id}
                         onClick={() => updatePreference('background', bg.url)}
                         className={`relative h-[80px] rounded-2xl overflow-hidden group transition-all border ${
                           preferences.background === bg.url 
                           ? 'border-[var(--accent-color)] shadow-[0_0_15px_rgba(255,255,255,0.1)] scale-[1.02] z-10' 
                           : 'border-transparent hover:border-white/10'
                         }`}
                       >
                          {bg.url !== 'none' ? (
                            <img src={bg.url} alt={bg.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500" />
                          ) : (
                            <div className="absolute inset-0 bg-black/30" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/10 transition-colors">
                             <span className="font-bold text-white text-[13px] tracking-wide">{bg.name}</span>
                          </div>
                       </button>
                     ))}
                  </div>

                  <form onSubmit={handleBgSubmit} className="mb-4">
                    <input 
                      type="url" 
                      placeholder="Paste image URL (https://...)" 
                      value={bgInput}
                      onChange={e => setBgInput(e.target.value)}
                      className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl px-6 py-4 outline-none focus:border-[var(--accent-color)] transition-all font-mono text-[14px]"
                    />
                  </form>
                  <div className="relative border-2 border-dashed border-[rgba(255,255,255,0.1)] rounded-3xl p-8 flex flex-col items-center justify-center bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[var(--accent-color)] transition-all group cursor-pointer overflow-hidden min-h-[160px]">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" />
                    <UploadCloud size={32} className="opacity-40 group-hover:-translate-y-2 group-hover:text-[var(--accent-color)] group-hover:opacity-100 mb-3 transition-all duration-300" />
                    <p className="text-[15px] font-bold opacity-80 group-hover:opacity-100 transition-colors tracking-wide">Drag & drop / Browse image</p>
                    <p className="text-xs opacity-40 mt-2 font-semibold">MAX 5MB FILE</p>
                  </div>
               </div>
             </div>

             {/* Sub: Themes */}
             <div className="mb-14">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-10 h-14 bg-[rgba(255,255,255,0.05)] rounded-r-xl flex items-center justify-center">
                   <div className="w-1.5 h-6 bg-[var(--text-color)] opacity-30 rounded-full" />
                 </div>
                 <ChevronUp size={22} className="opacity-50" />
                 <Palette size={24} className="opacity-70" />
                 <span className="text-2xl font-bold tracking-wide">Color Theme</span>
               </div>
               <div className="pl-6 lg:pl-[100px] flex flex-col gap-8">
                 
                 <div>
                   <h3 className="opacity-60 text-[14px] font-bold uppercase tracking-widest mb-4">Base</h3>
                   <div className="flex gap-4 h-[60px] md:h-[70px]">
                     {BASE_THEMES.map(theme => (
                       <button
                         key={theme.id}
                         onClick={() => handleThemeSelect(theme.id)}
                         className={`flex-1 flex items-center gap-3 justify-center text-[17px] ${preferences.theme === theme.id ? 'bg-white text-black' : 'btn-inactive'}`}
                       >
                         {theme.name}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div>
                   <h3 className="opacity-60 text-[14px] font-bold uppercase tracking-widest mb-4">Dark Styles</h3>
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                     {DARK_THEMES.map(theme => (
                       <button
                         key={theme.id}
                         onClick={() => handleThemeSelect(theme.id)}
                         className={`h-[60px] md:h-[70px] flex items-center justify-center text-[15px] font-bold rounded-2xl transition-all border border-transparent ${
                           preferences.theme === theme.id 
                           ? 'shadow-[0_4px_0_rgba(0,0,0,0.4)] translate-y-[-2px] border-[var(--bg-color)]' 
                           : 'shadow-[0_4px_0_rgba(0,0,0,0.15)] hover:bg-[rgba(255,255,255,0.08)]'
                         }`}
                         style={{ 
                           backgroundColor: preferences.theme === theme.id ? theme.color : 'rgba(255, 255, 255, 0.04)',
                           color: theme.text,
                           borderColor: preferences.theme === theme.id ? theme.text : 'rgba(255, 255, 255, 0.02)'
                         }}
                       >
                         {theme.name}
                       </button>
                     ))}
                   </div>
                 </div>

               </div>
             </div>

             {/* Sub: Typography */}
             <div>
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-10 h-14 bg-[rgba(255,255,255,0.05)] rounded-r-xl flex items-center justify-center">
                   <div className="w-1.5 h-6 bg-[var(--text-color)] opacity-30 rounded-full" />
                 </div>
                 <ChevronUp size={22} className="opacity-50" />
                 <Type size={24} className="opacity-70" />
                 <span className="text-2xl font-bold tracking-wide">Typography</span>
               </div>
               <div className="pl-6 lg:pl-[100px] grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {FONTS.map(font => (
                    <button
                      key={font.id}
                      onClick={() => updatePreference('fontFamily', font.id)}
                      className={`h-[60px] md:h-[70px] flex items-center justify-center text-[15px] ${font.id} ${preferences.fontFamily === font.id ? 'bg-white text-black' : 'btn-inactive'}`}
                    >
                      {font.name}
                    </button>
                  ))}
               </div>
             </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* EFFECTS TAB */}
        {/* ======================================================== */}
        {activeTab === 'effects' && (
          <div className={`animate-in fade-in slide-in-from-bottom-4 duration-500 ${glassPanel}`}>
             
             {/* Sub: Visuals */}
             <div className="mb-14">
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-10 h-14 bg-[rgba(255,255,255,0.05)] rounded-r-xl flex items-center justify-center">
                   <div className="w-1.5 h-6 bg-[var(--text-color)] opacity-30 rounded-full" />
                 </div>
                 <ChevronUp size={22} className="opacity-50" />
                 <MousePointer2 size={24} className="opacity-70" />
                 <span className="text-2xl font-bold tracking-wide">Cursor Visuals</span>
               </div>
               
               <div className="pl-6 lg:pl-[100px] flex flex-col gap-10">
                 
                 <div>
                   <p className="opacity-80 text-[15px] font-medium mb-4">Cursor Trails (while moving):</p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {STICKERS.map(sticker => (
                       <button
                         key={sticker.id}
                         onClick={() => updatePreference('cursorTrail', sticker.id)}
                         className={`h-[60px] md:h-[70px] flex items-center justify-center gap-2 text-[17px] ${preferences.cursorTrail === sticker.id ? 'bg-white text-black' : 'btn-inactive'}`}
                       >
                         {sticker.icon} {sticker.id === 'none' && <span className="opacity-50">none</span>}
                       </button>
                     ))}
                   </div>
                 </div>

                 <div>
                   <p className="opacity-80 text-[15px] font-medium mb-4">Click Particles (on mouse press):</p>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {STICKERS.map(sticker => (
                       <button
                         key={sticker.id}
                         onClick={() => updatePreference('clickEffect', sticker.id)}
                         className={`h-[60px] md:h-[70px] flex items-center justify-center gap-2 text-[17px] ${preferences.clickEffect === sticker.id ? 'bg-white text-black' : 'btn-inactive'}`}
                       >
                         {sticker.icon} {sticker.id === 'none' && <span className="opacity-50">none</span>}
                       </button>
                     ))}
                   </div>
                 </div>

               </div>
             </div>

             {/* Sub: Audio */}
             <div>
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-10 h-14 bg-[rgba(255,255,255,0.05)] rounded-r-xl flex items-center justify-center">
                   <div className="w-1.5 h-6 bg-[var(--text-color)] opacity-30 rounded-full" />
                 </div>
                 <ChevronUp size={22} className="opacity-50" />
                 <Music size={24} className="opacity-70" />
                 <span className="text-2xl font-bold tracking-wide">Focus Audio (BGM)</span>
               </div>
               
               <div className="pl-6 lg:pl-[100px]">
                 <p className="opacity-80 text-[15px] font-medium mb-4">Continuous background chill tracks to enhance focus:</p>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {BGMS.map(bgm => (
                     <button
                       key={bgm.id}
                       onClick={() => updatePreference('soundTheme', bgm.id)}
                       className={`h-[60px] md:h-[70px] flex items-center justify-center gap-2 text-[15px] ${preferences.soundTheme === bgm.id ? 'bg-white text-black' : 'btn-inactive'}`}
                     >
                       {bgm.id === 'none' ? <VolumeX size={18} className="opacity-50" /> : <Music size={18} />}
                       {bgm.name}
                     </button>
                   ))}
                 </div>
               </div>
             </div>

          </div>
        )}

      </div>
    </div>
  );
}
