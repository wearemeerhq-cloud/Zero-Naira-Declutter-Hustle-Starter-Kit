import React from 'react';
import { Sparkles, BookOpen, ShieldCheck, RefreshCw, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onStart: () => void;
  onOpenAdmin: () => void;
  savedKitAvailable: boolean;
  onLoadSavedKit: () => void;
  ebookUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStart,
  onOpenAdmin,
  savedKitAvailable,
  onLoadSavedKit,
  ebookUrl = 'https://selar.co/zero-naira-declutter-hustle',
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand Title */}
        <div 
          onClick={onStart}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-slate-900 flex items-center gap-1.5">
              Zero-Naira <span className="text-teal-600 font-extrabold">Hustle</span>
            </div>
            <div className="text-[10px] text-amber-600 tracking-wide font-bold">STARTER KIT BUILDER</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {savedKitAvailable && (
            <button
              onClick={onLoadSavedKit}
              className="text-xs px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">My Saved Kit</span>
              <span className="sm:hidden">Kit</span>
            </button>
          )}

          <a
            href={ebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Purchase Full Ebook</span>
            <span className="md:hidden">Full Ebook</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={onStart}
            className="text-xs px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm transition-all cursor-pointer"
          >
            Build Free Kit
          </button>

          <button
            onClick={onOpenAdmin}
            title="Admin Lead CRM"
            className="px-2.5 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span className="hidden lg:inline">Admin Leads</span>
          </button>
        </div>
      </div>
    </header>
  );
};
