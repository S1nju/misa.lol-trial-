import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-[#EBEBEB] bg-[#FFFFFF] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-[#222222] tracking-tight">misa.lol</span>
          <span className="text-xs text-[#717171] font-medium ml-2">Profile Editor</span>
        </div>
        <div className="text-xs text-[#717171] font-medium bg-[#F7F7F7] px-3.5 py-1.5 rounded-full border border-[#EBEBEB]">
          Server Validation Active
        </div>
      </div>
    </header>
  );
};
