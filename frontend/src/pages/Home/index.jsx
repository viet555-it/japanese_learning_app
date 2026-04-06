import React from "react";
import { Link } from "react-router-dom";
import ModeCard from "../../components/common/ModeCard";
import bgImage from "../../assets/images/kanji-bg.png";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <div
      className="min-h-screen w-full bg-cover flex items-center justify-center relative bg-fixed transition-all"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Main Content Modal */}
      <div className="relative z-10 w-full max-w-[800px] flex flex-col gap-1 mx-4">
        {/* Top Info Panel */}
        <div className="bg-[#151515]/95 backdrop-blur-md px-5 py-8 md:px-10 md:py-12 rounded-t-xl rounded-b-sm flex flex-col items-center text-center shadow-lg border border-white/5">
          {/* Title row */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
            <h1 className="text-2xl md:text-4xl font-normal text-white tracking-wide">
              Welcome to GoJapan!
            </h1>
            <img src={logo} alt="GoJapan logo" className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full object-cover shrink-0 shadow-[0_0_15px_rgba(191,29,44,0.6)]" />
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3 mb-4">
            {isAuthenticated ? (
              <button 
                onClick={() => logout()}
                className="text-sm font-bold text-black uppercase tracking-widest px-4 py-2 bg-white rounded-lg hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="text-sm font-bold text-[#999] hover:text-white uppercase tracking-widest transition-all px-4 py-2 border border-white/5 hover:border-white/20 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="text-sm font-bold text-black uppercase tracking-widest px-4 py-2 bg-white rounded-lg hover:bg-gray-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <p className="text-base md:text-xl text-[#b0b0b0] font-light leading-relaxed max-w-2xl">
            GoJapan is an aesthetic, community-made platform for learning Japanese inspired by Duolingo and Monkeytype.<br className="hidden sm:block"/>
            To begin, pick a dojo below and start demo training now!
          </p>
        </div>

        {/* Mode Cards Panel */}
        <div className="bg-[#151515]/95 backdrop-blur-md rounded-b-xl rounded-t-sm flex flex-col sm:flex-row shadow-lg border border-white/5 overflow-hidden">
          <ModeCard japanese="あ" title="Kana" path="/kana" borderRight />
          <ModeCard japanese="語" title="Vocab" path="/vocab" borderRight />
          <ModeCard japanese="漢字" title="Kanji" path="/kanji" borderRight={false} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;