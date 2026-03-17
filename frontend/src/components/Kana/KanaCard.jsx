import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const KanaCard = ({ title, sections }) => {
  return (
    <div className="bg-[#2a2a2a] rounded-xl flex flex-col overflow-hidden border border-white/5">
      {/* Title Header */}
      <div className="flex items-center gap-2 p-5 pb-3">
        <ChevronUp size={18} className="text-gray-400" />
        <h3 className="text-[19px] font-normal text-[#e5e5e5]">{title}</h3>
      </div>

      {/* Sections list */}
      <div className="flex flex-col px-5 pb-5">
        {sections.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 py-3 cursor-pointer
                       hover:text-white transition text-[#d0d0d0] text-lg font-light
                       ${index !== 0 ? 'border-t border-white/10' : ''}`}
          >
            <ChevronDown size={18} className="text-gray-400" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanaCard;