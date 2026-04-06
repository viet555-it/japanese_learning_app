import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, MousePointer2, Loader2, Zap, Sword, Play } from 'lucide-react';
import { getKanji, getLessons } from '../../api/learningApi';
import { useNavigate } from 'react-router-dom';

const units = [
  { id: 1, badge: 'N5', label: 'Unit 1', levelValue: 'N5', range: 'Levels 1-8' },
  { id: 2, badge: 'N4', label: 'Unit 2', levelValue: 'N4', range: 'Levels 9-25' },
  { id: 3, badge: 'N3', label: 'Unit 3', levelValue: 'N3', range: 'Levels 26-62' },
  { id: 4, badge: 'N2', label: 'Unit 4', levelValue: 'N2', range: 'Levels 63-100' },
  { id: 5, badge: 'N1', label: 'Unit 5', levelValue: 'N1', range: 'Levels 101-251' },
];

const KanjiCard = ({ char, on, kun, meaning }) => (
  <div 
    onClick={() => window.open(`https://thekanjimap.com/`, '_blank')}
    className="p-5 border-b border-white/10 last:border-b-0 space-y-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
  >
    <div className="flex gap-4 items-start">
      {/* Kanji Square */}
      <div className="relative w-[100px] h-[100px] shrink-0 border border-gray-600 rounded-lg flex items-center justify-center bg-[#242424] overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-gray-600 opacity-50"></div>
        <div className="absolute left-1/2 top-0 h-full border-l border-dashed border-gray-600 opacity-50"></div>
        <span className="text-[60px] font-sans text-white z-10 leading-none pb-2">{char}</span>
      </div>

      {/* Readings */}
      <div className="flex-1 space-y-3 pt-1">
         <div>
           <span className="text-[11px] text-[#aaa] font-bold block mb-1">On</span>
           <div className="flex flex-wrap gap-1.5">
             {on.length > 0 && on[0] !== "" ? on.map((r, i) => (
               <div key={`on-${i}`} className="flex-1 min-w-[40px] bg-[#1a1a1a] rounded flex items-center justify-center py-2 px-1 border border-[#333]">
                 <span className="text-[12px] text-[#ddd] text-center">{r}</span>
               </div>
             )) : (
               <div className="flex-1 bg-transparent py-2"></div>
             )}
           </div>
         </div>
         <div>
           <span className="text-[11px] text-[#aaa] font-bold block mb-1">Kun</span>
           <div className="flex flex-wrap gap-1.5">
             {kun.length > 0 && kun[0] !== "" ? kun.map((r, i) => (
               <div key={`kun-${i}`} className="flex-1 min-w-[40px] bg-[#1a1a1a] rounded flex items-center justify-center py-2 px-1 border border-[#333]">
                 <span className="text-[12px] text-[#ddd] text-center">{r}</span>
               </div>
             )) : (
               <div className="flex-1 bg-transparent py-2"></div>
             )}
           </div>
         </div>
      </div>
    </div>

    <div className="text-[17px] text-[#eee] leading-snug">
       {meaning}
    </div>
  </div>
);

const LevelColumn = ({ title, kanji, lessonId, onSelect, isSelected }) => (
  <div className="flex-1 min-w-[300px] border-r border-[#303030] last:border-r-0 flex flex-col h-[700px]">
    <div className="p-4 border-b border-[#303030]">
      <div 
        onClick={() => onSelect(lessonId)}
        className={`w-full py-3 rounded-full flex items-center justify-center gap-3 cursor-pointer transition-all ${
          isSelected ? 'bg-[#dddddd] text-black shadow-sm' : 'bg-[#1a1a1a] text-[#888] hover:bg-[#252525] border border-[#333]'
        }`}
      >
        <div className={`w-4 h-4 rounded-full border-[2px] flex items-center justify-center ${isSelected ? 'border-black' : 'border-gray-500'}`}>
          {isSelected && <div className="w-2 h-2 bg-black rounded-full" />}
        </div>
        <span className="font-bold text-[15px]">{title}</span>
      </div>
    </div>
    
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {kanji.length === 0
        ? <div className="py-12 text-center text-[#555] text-[15px]">No kanji in this level</div>
        : kanji.map((k, i) => (
            <KanjiCard 
              key={i} 
              char={k.Character} 
              on={k.Onyomi ? k.Onyomi.split(',').map(s => s.trim()) : []} 
              kun={k.Kunyomi ? k.Kunyomi.split(',').map(s => s.trim()) : []} 
              meaning={k.Meaning} 
            />
          ))
      }
    </div>
  </div>
);

export default function KanjiPage() {
  const [activeUnitId, setActiveUnitId] = useState(1);
  const [lessons, setLessons] = useState([]);
  const [kanjiByLesson, setKanjiByLesson] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedLessonIds, setSelectedLessonIds] = useState([]);
  const [welcomeOpen, setWelcomeOpen] = useState(true);
  const navigate = useNavigate();

  const activeUnit = units.find(u => u.id === activeUnitId);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const lessonData = await getLessons({ level: activeUnit.levelValue, type: 'Kanji' });
        setLessons(lessonData);
        
        const kanjiMap = {};
        for (const lesson of lessonData) {
          const kanjiData = await getKanji(lesson.LessonID);
          kanjiMap[lesson.LessonID] = kanjiData || [];
        }
        setKanjiByLesson(kanjiMap);
        if (lessonData.length > 0) {
          setSelectedLessonIds([]);
        }
      } catch (error) {
        console.error("Error loading Kanji data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeUnitId]);

  const handleStart = (playType) => {
    if (selectedLessonIds.length > 0) {
      navigate('/training/setup', { state: { lessonIds: selectedLessonIds, type: 'Kanji', playType } });
    } else {
      alert("Please select at least 1 level first.");
    }
  };

  const handleQuickSelect = () => {
    if (lessons && lessons.length > 0) {
      const allIds = lessons.map(l => l.LessonID);
      if (selectedLessonIds.length === allIds.length) {
        setSelectedLessonIds([]); 
      } else {
        setSelectedLessonIds(allIds);
      }
    }
  };

  const toggleSelect = (id) => {
    setSelectedLessonIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#1f1f1f] text-white flex flex-col relative pb-32 font-sans">
      <div className="px-4 md:px-8 py-6 md:py-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-[32px] font-bold">字</span>
          <h1 className="text-[32px] font-bold tracking-tight">Kanji</h1>
        </div>

        {/* Welcome Banner */}
        <div className="bg-[#242424] rounded-lg px-6 py-5 cursor-pointer border border-[#303030]" onClick={() => setWelcomeOpen(!welcomeOpen)}>
          <h2 className="text-[17px] font-semibold text-[#ccc] flex items-center gap-3">
            {welcomeOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            Welcome to the kanji dojo!
          </h2>
          {welcomeOpen && (
            <div className="text-[#a0a0a0] text-[15px] leading-relaxed mt-4 pl-8 space-y-1">
              <p>This is the place where you can learn and practice the main component of the Japanese writing system - the kanji characters.</p>
              <p>To begin, select at least 1 level, select your training mode, then hit Go! below and start training!</p>
              <p className="mt-2 text-[#ccc]">New: click on a kanji character to find out more about it on <a href="https://thekanjimap.com/" target="_blank" rel="noopener noreferrer" className="underline cursor-pointer hover:text-white">Kanji Heatmap</a>!</p>
            </div>
          )}
        </div>

        {/* Units Selector */}
        <div className="bg-[#242424] rounded-2xl border border-[#303030] p-2 flex overflow-x-auto custom-scrollbar">
          {units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => setActiveUnitId(unit.id)}
              className={`flex-1 min-w-[120px] flex flex-col items-center justify-center py-4 rounded-xl transition-all ${
                activeUnitId === unit.id 
                  ? 'bg-white text-black shadow-md' 
                  : 'bg-transparent text-[#777] hover:text-[#ccc]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[16px] font-bold">{unit.label}</span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center justify-center ${
                  activeUnitId === unit.id ? 'bg-[#666] text-white' : 'bg-[#333] text-[#aaa]'
                }`}>{unit.badge}</span>
              </div>
              <span className={`text-[12px] ${activeUnitId === unit.id ? 'text-[#555]' : 'text-[#666]'}`}>
                {unit.range}
              </span>
            </button>
          ))}
        </div>

        {/* Tip Bar */}
        <div className="bg-[#242424] rounded-lg border border-[#303030] px-5 py-4 text-[#aaa] text-[14px]">
          <strong className="text-[#eee] font-bold">Tip: </strong> 
          Complete some practice sessions to unlock the 'Hide Mastered Sets' filter. Sets become mastered when you achieve 90%+ accuracy with 10+ attempts per word.
        </div>

        {/* Quick Select Button */}
        <button
          onClick={handleQuickSelect}
          className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black opacity-80 hover:opacity-100 text-[15px]"
        >
          <MousePointer2 size={16} className="fill-black" />
          Quick Select
        </button>

        {/* Main Grid Section */}
        <div className="bg-[#242424] rounded-xl border border-[#303030] overflow-hidden">
           <div className="px-6 py-5 flex items-center gap-2 text-[18px] text-[#ddd] border-b border-[#303030]">
             <ChevronUp size={20} />
             <span>Levels Overview</span>
           </div>
           
           {loading ? (
             <div className="py-24 flex flex-col items-center gap-4 text-gray-500">
               <Loader2 className="animate-spin text-[#6a9fc0]" size={40} />
             </div>
           ) : (
             <div className="flex overflow-x-auto w-full custom-scrollbar bg-[#1f1f1f]">
               {lessons.length === 0 ? (
                 <div className="w-full py-16 text-center text-[#666]">No lessons found for this unit.</div>
               ) : (
                 lessons.map((lesson) => (
                   <LevelColumn 
                     key={lesson.LessonID}
                     title={lesson.Title}
                     lessonId={lesson.LessonID}
                     isSelected={selectedLessonIds.includes(lesson.LessonID)}
                     onSelect={toggleSelect}
                     kanji={kanjiByLesson[lesson.LessonID] || []}
                   />
                 ))
               )}
             </div>
           )}
        </div>

      </div>

      {/* Bottom Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-[280px] bg-[#1f1f1f] border-t border-[#333] px-4 py-4 md:p-6 z-40">
        <div className="max-w-7xl mx-auto flex gap-2 md:gap-4">
          <button 
            onClick={() => handleStart('blitz')}
            className="flex-1 md:max-w-[200px] flex items-center justify-center gap-2 py-3 md:py-4 bg-white text-black opacity-80 hover:opacity-100 text-[14px] md:text-[15px]"
          >
            <Zap size={18} className="fill-black" />
            Blitz
          </button>
          <button 
            onClick={() => handleStart('gauntlet')}
            className="flex-1 md:max-w-[200px] flex items-center justify-center gap-2 py-3 md:py-4 bg-white text-black opacity-80 hover:opacity-100 text-[14px] md:text-[15px]"
          >
            <Sword size={18} className="fill-black" />
            Gauntlet
          </button>
          <button 
            onClick={() => handleStart('classic')}
            className="flex-1 flex items-center justify-center gap-2 py-3 md:py-4 bg-white text-black text-[16px] md:text-[18px]"
          >
            <Play size={20} className="fill-black" />
            Classic
          </button>
        </div>
      </div>
    </div>
  );
}
