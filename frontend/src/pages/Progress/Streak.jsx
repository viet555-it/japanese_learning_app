import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Calendar, CalendarDays, CalendarRange, Check } from 'lucide-react';
import { getUserLoginHistory } from '../../api/learningApi';
import { useAuth } from '../../context/AuthContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Today info
const today = new Date(); 
const todayYear  = today.getFullYear(); 
const todayMonth = today.getMonth();    
const todayDay   = today.getDate();     

// Utility to get YYYY-MM-DD
const getLocalDateString = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

// Month view: build weeks of current month
function buildMonthGrid(year, month, activeDates) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Convert Sunday=0 to Mon=0 offset
  const offset = (firstDay + 6) % 7;
  const weeks = [];
  let day = 1 - offset;
  while (day <= daysInMonth) {
    const week = [];
    for (let d = 0; d < 7; d++, day++) {
      if (day >= 1 && day <= daysInMonth) {
         week.push({ day, active: activeDates.has(getLocalDateString(year, month, day)) });
      } else {
         week.push(null);
      }
    }
    weeks.push(week);
  }
  return weeks;
}

// Year view: 4 weeks per month column × 7 days rows
function buildYearGrid(year, activeDates) {
  // For each month, just show 4 weeks (28 cells)
  return MONTHS.map((m, mi) => {
    const daysInMonth = new Date(year, mi + 1, 0).getDate();
    const cells = Array.from({ length: 28 }, (_, i) => {
      const d = i + 1;
      const exists = d <= daysInMonth;
      return {
        exists,
        active: exists && activeDates.has(getLocalDateString(year, mi, d)),
      };
    });
    return { month: m, cells };
  });
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, icon, value, unit, sub }) => (
  <div className="flex-1 bg-[#141414] rounded-2xl border border-white/5 p-6">
    <div className="flex items-center justify-between mb-5">
      <span className="text-[15px] text-[#888] font-medium">{label}</span>
      <span className="text-[#888]">{icon}</span>
    </div>
    <div className="flex items-baseline gap-2 mb-2">
      <span className="text-[48px] font-bold text-white leading-none">{value}</span>
      <span className="text-[22px] text-[#888] font-medium">{unit}</span>
    </div>
    <p className="text-[#555] text-[15px]">{sub}</p>
  </div>
);

// ── Week View ─────────────────────────────────────────────────────────────────
const WeekView = ({ activeDates }) => {
  // Calculate current week's dates
  const curr = new Date();
  const day = curr.getDay() || 7; // Convert 0 (Sun) to 7
  const firstDayOfWeek = new Date(curr);
  firstDayOfWeek.setDate(curr.getDate() - day + 1);
  
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(firstDayOfWeek);
    d.setDate(d.getDate() + i);
    return getLocalDateString(d.getFullYear(), d.getMonth(), d.getDate());
  });

  return (
    <div className="px-8 py-6">
      <div className="flex justify-center gap-5">
        {DAYS.map((d, i) => {
          const isActive = activeDates.has(weekDates[i]);
          return (
            <div key={d} className="flex flex-col items-center gap-3">
              <span className="text-[14px] text-[#555] font-medium">{d}</span>
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${
                isActive ? 'bg-white/20 border-white/40 text-white' : 'bg-[#1e1e1e] border-white/5'
              }`}>
                {isActive && <Check size={20} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Month View ────────────────────────────────────────────────────────────────
const MonthView = ({ activeDates }) => {
  const weeks = buildMonthGrid(todayYear, todayMonth, activeDates);
  const monthName = new Date(todayYear, todayMonth).toLocaleString('en', { month: 'long' });

  return (
    <div className="px-8 py-6">
      <p className="text-[20px] font-bold text-white mb-5">{monthName}</p>
      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col gap-2 mr-2">
          {DAYS.map(d => (
            <span key={d} className="text-[13px] text-[#555] font-medium w-8 text-right leading-6">{d}</span>
          ))}
        </div>
        {/* Weeks columns */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-2">
            {DAYS.map((_, di) => {
              const cell = week[di];
              return (
                <div key={di} className={`w-6 h-6 rounded-md border ${
                  !cell
                    ? 'border-transparent bg-transparent'
                    : cell.active
                    ? 'bg-white/30 border-white/50'
                    : 'bg-[#1e1e1e] border-white/5'
                }`} />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Year View ─────────────────────────────────────────────────────────────────
const YearView = ({ activeDates }) => {
  const grid = buildYearGrid(todayYear, activeDates);

  return (
    <div className="px-6 py-6 overflow-x-auto">
      <p className="text-[20px] font-bold text-white mb-5">{todayYear}</p>
      <div className="flex gap-1 min-w-max">
        {/* Day labels */}
        <div className="flex flex-col gap-1.5 mr-2 mt-7">
          {DAYS.map(d => (
            <span key={d} className="text-[12px] text-[#555] font-medium w-7 text-right leading-5">{d}</span>
          ))}
        </div>
        {/* Month columns */}
        {grid.map(({ month, cells }) => (
          <div key={month} className="flex flex-col">
            <span className="text-[12px] text-[#555] font-medium mb-2 text-center">{month}</span>
            {/* 7 rows (days) × 4 weeks */}
            <div className="flex gap-1">
              {[0, 1, 2, 3].map(week => (
                <div key={week} className="flex flex-col gap-1.5">
                  {DAYS.map((_, di) => {
                    const cellIdx = week * 7 + di;
                    const cell = cells[cellIdx];
                    return (
                      <div key={di} className={`w-5 h-5 rounded-sm border ${
                        !cell?.exists
                          ? 'border-transparent bg-transparent'
                          : cell?.active
                          ? 'bg-white/30 border-white/50'
                          : 'bg-[#1e1e1e] border-white/5'
                      }`} />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main StreakTab ─────────────────────────────────────────────────────────────
export default function StreakTab() {
  const [calView, setCalView] = useState('week');
  const { user } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const activeUserId = user?.UserID || user?.id;
    if (activeUserId) {
      getUserLoginHistory(activeUserId)
        .then(data => setHistory(data || []))
        .catch(console.error);
    }
  }, [user]);

  // compute active dates
  // activeDates: Set of "YYYY-MM-DD"
  const activeDates = new Set(history.map(session => {
    const d = new Date(session.StartTime);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  }));

  const totalVisits = activeDates.size;
  let currentStreak = 0;
  let longestStreak = 0;

  if (activeDates.size > 0) {
    const sortedDates = Array.from(activeDates).sort((a,b) => new Date(b) - new Date(a));
    let maxStreak = 1;
    let tempStreak = 1;

    for (let i = 0; i < sortedDates.length - 1; i++) {
      const current = new Date(sortedDates[i]);
      const next = new Date(sortedDates[i+1]);
      const diffTime = Math.abs(current - next);
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays === 1) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(maxStreak, 1);

    const todayStr = new Date();
    todayStr.setMinutes(todayStr.getMinutes() - todayStr.getTimezoneOffset());
    const tStr = todayStr.toISOString().split('T')[0];

    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    yesterdayDate.setMinutes(yesterdayDate.getMinutes() - yesterdayDate.getTimezoneOffset());
    const yStr = yesterdayDate.toISOString().split('T')[0];

    if (sortedDates[0] === tStr || sortedDates[0] === yStr) {
      let cStreak = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const current = new Date(sortedDates[i]);
        const next = new Date(sortedDates[i+1]);
        const diffTime = Math.abs(current - next);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 
        if (diffDays === 1) {
          cStreak++;
        } else {
          break;
        }
      }
      currentStreak = cStreak;
    }
  }

  return (
    <div className="space-y-5">
      <h2 className="text-[32px] font-bold text-white">Visit Streak</h2>

      {/* 3 stat cards */}
      <div className="flex gap-4">
        <StatCard label="Current Streak" icon={<Flame size={20} />}    value={currentStreak} unit="day" sub={currentStreak > 0 ? "Keep it going!" : "Start your streak today!"} />
        <StatCard label="Longest Streak" icon={<Trophy size={20} />}   value={longestStreak} unit="day" sub="You're at your best!"   />
        <StatCard label="Total Visits"   icon={<Calendar size={20} />} value={totalVisits} unit="day" sub="Days you've practiced"  />
      </div>

      {/* Calendar */}
      <div className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
        {/* Week / Month / Year tabs */}
        <div className="flex border-b border-white/5">
          {[
            { key: 'week',  label: 'Week',  icon: <Calendar size={16} />      },
            { key: 'month', label: 'Month', icon: <CalendarDays size={16} />  },
            { key: 'year',  label: 'Year',  icon: <CalendarRange size={16} /> },
          ].map(v => (
            <button
              key={v.key}
              onClick={() => setCalView(v.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-[16px] font-semibold transition-all relative
                ${calView === v.key ? 'text-white' : 'text-[#555] hover:text-[#999]'}`}
            >
              {v.icon}{v.label}
              {calView === v.key && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full" />}
            </button>
          ))}
        </div>

        {calView === 'week'  && <WeekView activeDates={activeDates} />}
        {calView === 'month' && <MonthView activeDates={activeDates} />}
        {calView === 'year'  && <YearView activeDates={activeDates} />}
      </div>

      {/* How it works */}
      <div className="bg-[#141414] rounded-2xl border border-white/5 px-7 py-6 space-y-3">
        <h3 className="text-[18px] font-bold text-white">How Streak Tracking Works</h3>
        <ul className="space-y-2 text-[#888] text-[16px]">
          <li>• Your visits are automatically tracked when you use GoJapan</li>
          <li>• Each day you practice counts toward your streak</li>
          <li>• Keep your streak going by visiting daily!</li>
        </ul>
      </div>
    </div>
  );
}
