import React from "react";
import ModeCard from "../../components/common/ModeCard";
import bgImage from "../../assets/images/kanji-bg.png";
import logo from "../../assets/images/logo.png";

const HomePage = () => {
  return (
    <div
      className="min-h-full h-full w-full bg-cover flex items-center justify-center relative bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Main Content Modal */}
      <div className="relative z-10 w-full max-w-[800px] flex flex-col gap-1 mx-4">
        {/* Top Info Panel */}
        <div className="bg-[#151515]/95 backdrop-blur-md px-10 py-12 rounded-t-xl rounded-b-sm flex flex-col items-center text-center shadow-lg border border-white/5">
          <div className="flex items-center gap-4 mb-5">
            <h1 className="text-4xl font-normal text-white tracking-wide">
              Welcome to GoJapanese!
            </h1>
            <img src={logo} alt="GoJapan logo" className="w-[50px] h-[50px] rounded-full object-cover ml-2 shrink-0 shadow-[0_0_15px_rgba(191,29,44,0.6)]" />
          </div>
          <p className="text-xl text-[#b0b0b0] font-light leading-relaxed max-w-2xl">
            GoJapanese is an aesthetic, community-made platform for learning Japanese inspired by Duolingo and Monkeytype.<br/>
            To begin, pick a dojo below and start training now!
          </p>
        </div>

        {/* Mode Cards Panel */}
        <div className="bg-[#151515]/95 backdrop-blur-md rounded-b-xl rounded-t-sm flex flex-row shadow-lg border border-white/5 overflow-hidden">
          <ModeCard japanese="あ" title="Kana" path="/kana" borderRight />
          <ModeCard japanese="語" title="Vocab" path="/vocab" borderRight />
          <ModeCard japanese="漢字" title="Kanji" path="/kanji" borderRight={false} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;