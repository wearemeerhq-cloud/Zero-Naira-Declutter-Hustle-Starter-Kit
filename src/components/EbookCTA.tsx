import React from 'react';
import { BookOpen, Check, ArrowRight, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { trackEvent } from '../services/analytics';

interface EbookCTAProps {
  ebookUrl: string;
  onContinueFree?: () => void;
}

export const EbookCTA: React.FC<EbookCTAProps> = ({ ebookUrl, onContinueFree }) => {
  const handlePurchaseClick = () => {
    trackEvent('ebook_cta_clicked', { url: ebookUrl });
    window.open(ebookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white border border-teal-200 rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden my-12">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 blur-[90px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>OFFICIAL EBOOK SALES PAGE</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          You've built the starter system. <br className="hidden sm:inline" />
          Now build the <span className="text-amber-600">actual hustle</span>.
        </h2>

        {/* Body Copy */}
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto">
          The Starter Kit gives you the initial spark. Click below to go directly to our official sales landing page and get the complete <strong className="text-slate-900">Zero-Naira Declutter Hustle</strong> ebook — including complete buyer board management, pricing formulas, trust protocols, 30-day plan, and master scripts.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-2xl mx-auto py-2">
          {[
            'How the model actually works in depth',
            'Sourcing sellers & finding ready buyers',
            'Exact pricing & commission formulas',
            'The complete 4-step sale cycle',
            'The Buyer Request Board system',
            'Getting paid safely & avoiding traps',
            'Turning 1 sale into 10 recurring referrals',
            'Complete 30-day launch blueprint',
            'Common middleman mistakes to avoid',
            'Free AI assistant workflows & master prompts',
            'The complete copy-paste toolkit'
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700">
              <div className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 border border-teal-200">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handlePurchaseClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base shadow-xl shadow-teal-600/20 border border-teal-500/30 transition-all transform active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Go To Ebook Sales Page to Purchase</span>
            <ExternalLink className="w-5 h-5" />
          </button>

          {onContinueFree && (
            <button
              onClick={onContinueFree}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm border border-slate-200 transition-colors cursor-pointer"
            >
              Continue With My Free Starter Kit
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-500 font-medium">
          Opens official checkout landing page in a new tab • Instant digital download PDF
        </p>

      </div>
    </div>
  );
};
