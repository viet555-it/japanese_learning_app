import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Star, Settings, MessageSquare, Menu, X } from "lucide-react";
import logo from "../../assets/images/logo.png";

const navItems = [
  { name: "Home",       path: "/",         icon: <Home size={24} strokeWidth={1.5} /> },
  { name: "Progess",    path: "/progress", icon: <Star size={24} strokeWidth={1.5} /> },
  { name: "Kana",       path: "/kana",     icon: <span className="text-[22px] leading-none">あ</span> },
  { name: "Vocabulary", path: "/vocab",    icon: <span className="text-[22px] leading-none">語</span> },
  { name: "Kanji",      path: "/kanji",    icon: <span className="text-[22px] leading-none">字</span> },
  { name: "Preferences", path: "/preferences", icon: <Settings size={24} strokeWidth={1.5} /> },
  { name: "Feedback",    path: "/feedback",    icon: <MessageSquare size={24} strokeWidth={1.5} /> },
];

const NavLinks = ({ onClose }) => {
  const location = useLocation();
  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`
              flex items-center gap-4 px-4 py-4 rounded-[1.25rem] transition-all duration-300
            `}
            style={{
              backgroundColor: isActive ? 'var(--accent-color)' : 'transparent',
              color: isActive ? 'var(--bg-color)' : 'var(--text-color)',
              opacity: isActive ? 1 : 0.6,
              fontWeight: isActive ? 800 : 500,
              transform: isActive ? 'scale(1)' : 'scale(0.98)'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                 e.currentTarget.style.opacity = 1;
                 e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                 e.currentTarget.style.opacity = 0.6;
                 e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <div className="w-7 flex items-center justify-center shrink-0 drop-shadow-sm">
              {item.icon}
            </div>
            <span className="text-[20px] tracking-wide mb-[1px]">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile Topbar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 theme-container border-b border-white/10 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <img src={logo} alt="GoJapan logo" className="w-[40px] h-[40px] rounded-full object-cover shrink-0" />
          <span className="text-[22px] font-bold tracking-wide" style={{ color: 'var(--text-color)' }}>GoJapan</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl transition-all"
          style={{ color: 'var(--text-color)', backgroundColor: 'rgba(255,255,255,0.05)' }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full z-50 w-[280px] theme-container border-r border-white/10 backdrop-blur-xl flex flex-col pt-7 px-5 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Link to="/" className="flex items-center gap-4 mb-6 pl-1 hover:opacity-80 transition-opacity" onClick={() => setMobileOpen(false)}>
          <img src={logo} alt="GoJapan logo" className="w-[56px] h-[56px] rounded-full object-cover shrink-0" />
          <span className="text-[28px] font-bold tracking-wide leading-tight" style={{ color: 'var(--text-color)' }}>GoJapan</span>
        </Link>
        <NavLinks onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-[280px] h-screen theme-container text-white flex-col pt-7 px-5 border-r border-white/10 shrink-0 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-4 mb-6 pl-1 hover:opacity-80 transition-opacity">
          <img src={logo} alt="GoJapan logo" className="w-[56px] h-[56px] rounded-full object-cover shrink-0" />
          <span className="text-[28px] font-bold tracking-wide text-white leading-tight">GoJapan</span>
        </Link>
        <NavLinks onClose={() => {}} />
      </aside>
    </>
  );
};

export default Sidebar;
