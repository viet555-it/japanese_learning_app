import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Star } from "lucide-react";
import logo from "../../assets/images/logo.png";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={20} strokeWidth={1.5} /> },
    { name: "Progess", path: "/progress", icon: <Star size={20} strokeWidth={1.5} /> },
    // Spacing before study modes
    { name: "Kana", path: "/kana", icon: <span className="text-[17px] leading-none">あ</span>, isSpaced: true },
    { name: "Vocabulary", path: "/vocab", icon: <span className="text-[17px] leading-none">語</span> },
    { name: "Kanji", path: "/kanji", icon: <span className="text-[17px] leading-none">字</span> },
  ];

  return (
    <aside className="w-[200px] h-screen bg-black text-[#f1f1f1] flex flex-col pt-5 px-3 border-r border-[#333] shrink-0 font-sans">
      {/* Logo Area */}
      <div className="flex items-center gap-2 mb-10 pl-2">
        <img src={logo} alt="GoJapan logo" className="w-[42px] h-[42px] rounded-full object-cover shrink-0" />
        <span className="text-[22px] font-medium tracking-wide">GoJapan</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-[2px]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <React.Fragment key={item.path}>
              {item.isSpaced && <div className="mt-8" />}
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-[#b0b0b0] hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="w-5 flex items-center justify-center text-[#d0d0d0]">
                  {item.icon}
                </div>
                <span className="text-[16px] tracking-wide font-light">{item.name}</span>
              </Link>
            </React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;