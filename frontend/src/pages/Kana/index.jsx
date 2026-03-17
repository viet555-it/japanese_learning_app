import React from "react";
import KanaCard from "../../components/kana/KanaCard";
import { ChevronUp, MousePointer2 } from "lucide-react";

const Kana = () => {
  return (
    <div className="max-w-[1000px] mx-auto pt-6 px-10 pb-20 space-y-6 flex flex-col items-stretch h-full">
      {/* Page Header */}
      <h1 className="text-3xl font-normal text-[#e5e5e5] mb-2 flex items-center gap-2 tracking-wide">
        あ Kana
      </h1>

      {/* Welcome Message Card */}
      <div className="bg-[#2a2a2a] rounded-xl p-5 border border-white/5">
        <h2 className="text-lg text-white mb-4 flex items-center gap-2 font-normal">
          <ChevronUp size={20} className="text-gray-400" />
          Welcome to the Kana(hiragana and katakana)!
        </h2>
        <div className="text-[15px] font-light text-[#a8a8a8] leading-[1.6] pl-[28px] pr-4 space-y-2 relative -top-2">
          <p>
            This is the place where you can learn and practice the two core syllabaries of Japanese - Hiragana and Katakana.
          </p>
          <p>
            To begin, select at leat 1 set of characters, sellect or change the tranning mode, then hit Go! below and start training now!
          </p>
        </div>
      </div>

      {/* Select All Button */}
      <button className="w-full flex items-center justify-center gap-3 bg-[#ffffff] text-[#111] 
                         py-[14px] rounded-[14px] font-medium text-[15px]
                         border-b-4 border-[#ded8cc] active:border-b-0 active:translate-y-[4px]
                         transition-all select-none">
        <MousePointer2 size={18} className="text-black rotate-[-10deg] fill-black" strokeWidth={2} />
        Select All Kana
      </button>

      {/* Kana Cards Grid */}
      <div className="grid grid-cols-2 gap-6 pt-2">
        <KanaCard 
          title="Hiragana ひらがな" 
          sections={["Base", "Dakuon", "Yoon"]} 
        />
        <KanaCard 
          title="Katakana カタカナ" 
          sections={["Base", "Dakuon", "Yoon", "Foreign sound"]} 
        />
      </div>
    </div>
  );
};

export default Kana;