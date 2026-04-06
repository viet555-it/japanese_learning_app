import React from "react";
import { useNavigate } from "react-router-dom";

const ModeCard = ({ japanese, title, path, borderRight }) => {
  const navigate = useNavigate();
  
  return (
    <div className={`flex-1 flex flex-col items-center justify-center 
                     py-8 sm:py-12 cursor-pointer 
                     hover:bg-white/5 transition duration-300
                     ${borderRight ? 'border-b sm:border-b-0 sm:border-r border-white/20' : ''}`}
         onClick={() => navigate(path)}
    >
      <div className="flex items-center gap-4">
        <span className="text-2xl font-normal text-[#e5e5e5]">{japanese}</span>
        <span className="text-2xl font-light tracking-wide text-[#e5e5e5]">{title}</span>
      </div>
    </div>
  );
};

export default ModeCard;