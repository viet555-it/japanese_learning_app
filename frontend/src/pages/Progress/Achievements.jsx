import React, { useState, useEffect } from 'react';
import { Trophy, Lock, Unlock, Star, Flame, BookOpen, AlignJustify, Zap, Target, Crown, Compass, Sparkles, RefreshCw } from 'lucide-react';
import { getUserAchievements, unlockAchievement, getUserHistory } from '../../api/learningApi';
import { useAuth } from '../../context/AuthContext';

// ── Data ──────────────────────────────────────────────────────────────────────
const categories = [
  { key: 'all',         label: 'All',         icon: <Trophy size={14} />,     count: 12, unlocked: 0  },
  { key: 'kana',        label: 'Kana',        icon: <span className="text-[13px]">あ</span>, count: 0,  unlocked: 0  },
  { key: 'kanji',       label: 'Kanji',       icon: <span className="text-[13px]">字</span>, count: 0, unlocked: 0  },
  { key: 'vocabulary',  label: 'Vocabulary',  icon: <span className="text-[13px]">語</span>, count: 0,  unlocked: 0  },
  { key: 'gauntlet',    label: 'Gauntlet',    icon: <Zap size={14} />,        count: 0, unlocked: 0  },
  { key: 'blitz',       label: 'Blitz',       icon: <Target size={14} />,     count: 0,  unlocked: 0  },
  { key: 'milestones',  label: 'Milestones',  icon: <Star size={14} />,       count: 5, unlocked: 0  },
  { key: 'streaks',     label: 'Streaks',     icon: <Flame size={14} />,      count: 4,  unlocked: 0  },
  { key: 'speed',       label: 'Speed',       icon: <Zap size={14} />,        count: 0,  unlocked: 0  },
  { key: 'consistency', label: 'Consistency', icon: <Target size={14} />,     count: 0,  unlocked: 0  },
  { key: 'mastery',     label: 'Mastery',     icon: <Crown size={14} />,      count: 0,  unlocked: 0  },
  { key: 'exploration', label: 'Exploration', icon: <Compass size={14} />,    count: 0,  unlocked: 0  },
  { key: 'fun',         label: 'Fun & Secret',icon: <Sparkles size={14} />,   count: 3, unlocked: 0  },
];

const rarityColors = {
  Common:    'text-[#aaa]  bg-[#2a2a2a]',
  Uncommon:  'text-[#6ab]  bg-[#1a2a2a]',
  Rare:      'text-[#6af]  bg-[#1a2040]',
  Epic:      'text-[#a6f]  bg-[#2a1a40]',
  Legendary: 'text-[#fa6]  bg-[#3a2a10]',
};

const rarityIcons = {
  Common:    <Star size={11} />,
  Uncommon:  <Star size={11} />,
  Rare:      <Trophy size={11} />,
  Epic:      <Trophy size={11} />,
  Legendary: <Crown size={11} />,
};

const baseAchievements = [
  { id: 1,  title: 'First Steps',          desc: 'Get your first correct answer',      rarity: 'Common',    xp: 10,   progress: 0,  total: 1,    unlocked: false, category: 'milestones' },
  { id: 2,  title: 'Streak Starter',       desc: 'Achieve a 5-answer streak (5 sessions)', rarity: 'Common',    xp: 25,   progress: 0,  total: 5,    unlocked: false, category: 'streaks'    },
  { id: 3,  title: 'Hot Streak',           desc: 'Achieve a 10-answer streak (10 sessions)', rarity: 'Uncommon',  xp: 50,   progress: 0,  total: 10,   unlocked: false, category: 'streaks'    },
  { id: 4,  title: 'Streak Legend',        desc: 'Achieve a 25-answer streak (25 sessions)', rarity: 'Rare',      xp: 150,  progress: 0,  total: 25,   unlocked: false, category: 'streaks'    },
  { id: 5,  title: 'Unstoppable',          desc: 'Achieve a 50-answer streak (50 sessions)', rarity: 'Epic',      xp: 300,  progress: 0,  total: 50,   unlocked: false, category: 'streaks'    },
  { id: 6,  title: 'Century Scholar',      desc: 'Answer 100 questions correctly',     rarity: 'Uncommon',  xp: 100,  progress: 0,  total: 100,  unlocked: false, category: 'milestones' },
  { id: 7,  title: 'Knowledge Seeker',     desc: 'Answer 500 questions correctly',     rarity: 'Rare',      xp: 250,  progress: 0,  total: 500,  unlocked: false, category: 'milestones' },
  { id: 8,  title: 'Master Scholar',       desc: 'Answer 1000 questions correctly',    rarity: 'Epic',      xp: 500,  progress: 0,  total: 1000, unlocked: false, category: 'milestones' },
  { id: 9,  title: 'Legendary Master',     desc: 'Answer 5000 questions correctly',    rarity: 'Legendary', xp: 1000, progress: 0,  total: 5000, unlocked: false, category: 'milestones' },
  { id: 10, title: 'Achievement Collector',desc: 'Unlock 3 achievements',              rarity: 'Rare',      xp: 250,  progress: 0,  total: 3,    unlocked: false, category: 'fun'        },
  { id: 11, title: 'Achievement Enthusiast',desc: 'Unlock 5 achievements',             rarity: 'Epic',      xp: 500,  progress: 0,  total: 5,    unlocked: false, category: 'fun'        },
  { id: 12, title: 'Completionist',        desc: 'Unlock all 11 achievements',         rarity: 'Legendary', xp: 2000, progress: 0,  total: 11,   unlocked: false, category: 'fun'        },
];

// ── Achievement Card ──────────────────────────────────────────────────────────
const AchievementCard = ({ id, title, desc, rarity, xp, progress, total, unlocked, onClaim }) => {
  const pct = Math.min((progress / total) * 100, 100);
  const isReady = !unlocked && progress >= total;
  const rarityStyle = rarityColors[rarity] || rarityColors.Common;

  return (
    <div className={`bg-[#141414] rounded-xl border p-5 flex flex-col gap-3 transition-all ${
        unlocked 
          ? 'border-yellow-500/30' 
          : isReady 
            ? 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
            : 'border-white/5'
      }`}>
      {/* Rarity badge */}
      <div className="flex justify-end">
        <span className={`flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full ${rarityStyle}`}>
          {rarityIcons[rarity]} {rarity}
        </span>
      </div>

      {/* Icon + title */}
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 transition-colors ${
            unlocked 
              ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500' 
              : isReady
                ? 'bg-green-500/20 border-green-500/50 text-green-500'
                : 'bg-[#222] border-white/8 text-[#555]'
          }`}>
          {unlocked ? <Trophy size={20} /> : isReady ? <Unlock size={20} className="animate-pulse" /> : <Lock size={20} />}
        </div>
        <div>
          <h3 className="text-[16px] font-bold text-white leading-tight">{title}</h3>
          <p className="text-[#666] text-[14px] mt-1 leading-snug">{desc}</p>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[13px] text-[#555]">Progress</span>
          <span className="text-[13px] font-semibold text-[#777]">{Math.min(progress, total)}/{total}</span>
        </div>
        <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ${
              unlocked 
                ? 'bg-yellow-500' 
                : isReady 
                  ? 'bg-green-500' 
                  : 'bg-white/30'
            }`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* XP + status */}
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <div className={`flex items-center gap-1.5 text-[13px] ${
            unlocked 
              ? 'text-yellow-500' 
              : isReady
                ? 'text-green-500'
                : 'text-[#666]'
          }`}>
          <Trophy size={13} />
          <span className="font-semibold">{xp} XP</span>
        </div>
        {isReady ? (
          <button 
             onClick={() => onClaim(id)}
             className="text-[12px] font-bold bg-green-500 text-black px-3 py-1 rounded-full hover:bg-green-400 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)] animate-pulse"
          >
             Claim Now
          </button>
        ) : (
          <span className={`text-[13px] font-bold tracking-wide ${
              unlocked 
                ? 'text-yellow-500' 
                : 'text-[#444]'
            }`}>
            {unlocked ? 'Unlocked' : 'Locked'}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AchievementsTab() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [achievements, setAchievements] = useState(baseAchievements);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Fetch initial data
  useEffect(() => {
    const activeUserId = user?.UserID || user?.id;
    if (activeUserId) {
      loadData(activeUserId);
    }
  }, [user]);

  const loadData = async (activeUserId) => {
    if (!activeUserId) return;
    try {
      setLoading(true);
      const [userAchs, hist] = await Promise.all([
        getUserAchievements(activeUserId),
        getUserHistory(activeUserId)
      ]);
      
      setHistory(hist || []);
      const unlockedIds = new Set((userAchs || []).map(a => a.AchievementID));
      
      let totalCorrectAnswers = 0;
      let totalSessions = (hist || []).length;
      
      (hist || []).forEach(session => {
          totalCorrectAnswers += Math.round((session.AccuracyRate || 0) / 100 * 10);
      });

      setAchievements(prev => {
          return prev.map(a => {
              let newProgress = a.progress;
              if (a.id === 1) newProgress = totalCorrectAnswers;
              if (a.id >= 2 && a.id <= 5) newProgress = totalSessions;
              if (a.id >= 6 && a.id <= 9) newProgress = totalCorrectAnswers;
              
              if (unlockedIds.has(a.id)) {
                  return { ...a, unlocked: true, progress: a.total };
              }
              // Automatically cap progress at total
              return { ...a, progress: Math.min(newProgress, a.total) };
          });
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleRecalculate = async () => {
    const activeUserId = user?.UserID || user?.id;
    if (!activeUserId) return;
    setLoading(true);
    
    let totalCorrectAnswers = 0;
    let totalSessions = history.length;
    let newUnlockedIds = new Set();
    
    history.forEach(session => {
        totalCorrectAnswers += Math.round((session.AccuracyRate || 0) / 100 * 10);
    });

    const checkAndUnlock = async (id, condition) => {
        if (condition) {
           try {
              const res = await unlockAchievement(activeUserId, id);
              if (res.unlocked) newUnlockedIds.add(id);
           } catch (e) { console.error(e); }
        }
    };

    // Attempt backend unlock
    await checkAndUnlock(1, totalCorrectAnswers >= 1);
    await checkAndUnlock(2, totalSessions >= 5);
    await checkAndUnlock(3, totalSessions >= 10);
    await checkAndUnlock(4, totalSessions >= 25);
    await checkAndUnlock(5, totalSessions >= 50);
    await checkAndUnlock(6, totalCorrectAnswers >= 100);
    await checkAndUnlock(7, totalCorrectAnswers >= 500);
    await checkAndUnlock(8, totalCorrectAnswers >= 1000);
    await checkAndUnlock(9, totalCorrectAnswers >= 5000);

    // Update frontend array again
    setAchievements(prev => {
        const next = prev.map(a => {
            if (a.unlocked || newUnlockedIds.has(a.id)) {
                return { ...a, unlocked: true, progress: a.total };
            }
            return a;
        });

        // check collector achievements
        const unlockedCount = next.filter(x => x.unlocked && x.id < 10).length;
        if (unlockedCount >= 3) checkAndUnlock(10, true);
        if (unlockedCount >= 5) checkAndUnlock(11, true);
        if (unlockedCount === 11) checkAndUnlock(12, true);

        return next;
    });

    // Final refresh from DB
    await loadData(activeUserId);
    setLoading(false);
  };

  const handleClaim = async (id) => {
    const activeUserId = user?.UserID || user?.id;
    if (!activeUserId) return;
    
    // Eager UI update
    setAchievements(prev => prev.map(a => a.id === id ? { ...a, unlocked: true } : a));

    try {
      const res = await unlockAchievement(activeUserId, id);
      if (res.unlocked) {
         // Also reload to check for 3/5/11 collector achievement progression
         await loadData(activeUserId);
      }
    } catch (e) {
      console.error("Failed to claim:", e);
      // Revert eager update on fail
      await loadData(activeUserId);
    }
  };


  const filtered = activeCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === activeCategory);

  const totalUnlocked = achievements.filter(a => a.unlocked).length;
  const totalXP = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);
  const level = Math.floor(totalXP / 100) + 1;
  const overallPct = Math.round((totalUnlocked / achievements.length) * 100) || 1;

  // Update dynamic category counts
  const dynamicCategories = categories.map(cat => {
      const catCount = cat.key === 'all' ? achievements.length : achievements.filter(a => a.category === cat.key).length;
      const catUnlocked = cat.key === 'all' ? totalUnlocked : achievements.filter(a => a.category === cat.key && a.unlocked).length;
      return { ...cat, count: catCount, unlocked: catUnlocked };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Trophy size={36} className="text-yellow-500" />
          <h2 className="text-[36px] font-bold text-white">Achievements</h2>
        </div>
        <p className="text-[#666] text-[16px]">Track your Japanese learning journey and celebrate your milestones</p>
      </div>

      {/* Overall Progress */}
      <div className="bg-[#141414] rounded-xl border border-white/5 px-7 py-5">
        <div className="flex justify-between mb-2">
          <span className="text-[16px] font-semibold text-white">Overall Progress</span>
          <span className="text-[16px] font-bold text-white">{overallPct}%</span>
        </div>
        <div className="w-full h-3 bg-[#222] rounded-full overflow-hidden">
          <div className="h-full bg-white/40 rounded-full transition-all" style={{ width: `${overallPct}%` }} />
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="flex gap-4">
        {[
          { value: totalUnlocked, label: 'Unlocked' },
          { value: achievements.length, label: 'Total' },
          { value: totalXP, label: 'XP' },
          { value: level, label: 'Level' },
        ].map(s => (
          <div key={s.label} className="flex-1 bg-[#141414] rounded-xl border border-white/5 py-6 flex flex-col items-center gap-1">
            <span className="text-[36px] font-bold text-white">{s.value}</span>
            <span className="text-[14px] text-[#666]">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {dynamicCategories.map(cat => {
          if (cat.count === 0 && cat.key !== 'all') return null; // hide empty categories
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-semibold transition-all border
                ${isActive
                  ? 'bg-white text-black border-white'
                  : 'bg-[#141414] text-[#888] border-white/5 hover:text-white hover:border-white/20'
                }`}
            >
              {cat.icon} {cat.label}
              <span className={`text-[12px] px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-black/10 text-black' : 'bg-white/10 text-[#666]'
              }`}>{cat.unlocked}/{cat.count}</span>
            </button>
          );
        })}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(a => <AchievementCard key={a.id} {...a} onClaim={handleClaim} />)}
      </div>

      {/* Achievement Management */}
      <div className="bg-[#141414] rounded-xl border border-white/5 p-6">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw size={18} className="text-white" />
          <h3 className="text-[18px] font-bold text-white">Achievement Management</h3>
        </div>
        <p className="text-[#666] text-[15px] mb-4">Check for any missed achievements based on your current progress.</p>
        <div className="bg-[#1a1a1a] rounded-xl border border-white/5 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[16px] font-semibold text-white">Recalculate Achievements</p>
            <p className="text-[#555] text-[14px]">Scan your progress and unlock any achievements you may have earned</p>
          </div>
          <button 
            onClick={handleRecalculate}
            disabled={loading}
            className={`flex items-center gap-2 border text-white px-5 py-2.5 rounded-xl text-[15px] font-semibold transition-all
              ${loading ? 'bg-[#333] border-[#444] text-[#888]' : 'bg-[#222] border-white/10 hover:bg-[#2a2a2a]'}`}
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> 
            {loading ? "Recalculating..." : "Recalculate"}
          </button>
        </div>
      </div>
    </div>
  );
}
