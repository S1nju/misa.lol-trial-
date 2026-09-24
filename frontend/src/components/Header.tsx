import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-[#EBEBEB] bg-[#FFFFFF] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#FF385C] flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#222222] tracking-tight">
              misa.lol
            </h1>
            <p className="text-xs text-[#717171]">Profile Editor</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#717171] bg-[#F7F7F7] px-3.5 py-1.5 rounded-full border border-[#DDDDDD]">
          <ShieldCheck className="w-4 h-4 text-[#008A05]" />
          <span className="font-medium">Server Validation Active</span>
        </div>
      </div>
    </header>
  );
};
