import React, { useState } from 'react';
import { TrendingUp, Flame, Trophy } from 'lucide-react';
import StreakTab from './Streak';
import AchievementsTab from './Achievements';
import StatsTab from './Stats';

const tabs = [
  { key: 'stats',        label: 'Stats',        icon: <TrendingUp size={18} /> },
  { key: 'streak',       label: 'Streak',       icon: <Flame size={18} />      },
  { key: 'achievements', label: 'Achievements', icon: <Trophy size={18} />     },
];

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* Top Tab Bar */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-4 sm:py-5 text-[14px] sm:text-[17px] font-semibold transition-all relative
                ${isActive ? 'text-white' : 'text-[#555] hover:text-[#999]'}
              `}
            >
              <span className={isActive ? 'text-white' : 'text-[#555]'}>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="px-4 sm:px-8 py-6 sm:py-10 flex-1">

        {/* Title — ẩn khi đang ở tab Streak */}
         {activeTab === 'stats' && (
          <div className="mb-6">
            <h1 className="text-[36px] font-bold tracking-tight">Your Progress</h1>
            <p className="text-[#555] text-[17px] mt-1">Track your Japanese learning journey</p>
          </div>
        )}

        {activeTab === 'stats'        && <StatsTab />}
        {activeTab === 'streak'       && <StreakTab />}
        {activeTab === 'achievements' && <AchievementsTab />}

      </div>
    </div>
  );
}
