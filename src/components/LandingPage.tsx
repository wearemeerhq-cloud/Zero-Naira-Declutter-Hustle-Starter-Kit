import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Smartphone, 
  MessageSquare, 
  ShoppingBag, 
  TrendingUp,
  FileText,
  Calendar,
  Shield,
  HelpCircle,
  Clock,
  Layers,
  Zap,
  Gift
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onOpenAdmin?: () => void;
  ebookUrl?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onOpenAdmin }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-200 bg-white">
        {/* Background Teal & Gold Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-teal-500/5 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-12 right-1/4 w-72 h-72 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold mb-6 animate-pulse">
            <Gift className="w-4 h-4 text-amber-500" />
            <span>Free Lead Magnet • The Zero-Naira Declutter Hustle</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15] mb-5">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-700 to-amber-600">Zero-Naira Hustle</span> Starter Kit
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-4 leading-relaxed">
            Turn other people's unused household items into potential commission opportunities — without buying stock.
          </p>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
            Tell us a little about yourself and what you want to sell. We'll build a personalized starter system with the scripts, templates and action plan you need to get started.
          </p>

          {/* Single Primary Hero CTA */}
          <div className="flex justify-center mb-6">
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-9 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-teal-600/20 hover:shadow-teal-600/30 transition-all transform active:scale-98 flex items-center justify-center gap-2.5 group cursor-pointer border border-teal-500/30"
            >
              <span>Build My Free Starter Kit</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Microcopy */}
          <p className="text-xs text-slate-500 flex items-center justify-center gap-2 font-medium">
            <span className="text-amber-600 font-bold">100% Free</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>AI-Powered</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Built for Beginners</span>
          </p>

          {/* WORKFLOW GRAPHIC SHOWCASE */}
          <div className="mt-12 sm:mt-16 p-4 sm:p-6 rounded-2xl bg-slate-50 border border-teal-200/80 shadow-md max-w-3xl mx-auto">
            <div className="text-xs uppercase tracking-wider font-bold text-teal-700 mb-4 text-center">
              The Middleman Workflow (No Inventory Required)
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-2 font-bold text-xs border border-teal-200">
                  1
                </div>
                <div className="text-xs font-bold text-slate-900 mb-1">INTAKE</div>
                <p className="text-[11px] text-slate-500 leading-snug">Agree terms & get photos from seller.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2 font-bold text-xs border border-amber-200">
                  2
                </div>
                <div className="text-xs font-bold text-slate-900 mb-1">LIST</div>
                <p className="text-[11px] text-slate-500 leading-snug">Post on Jiji, WhatsApp & Facebook.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 font-bold text-xs border border-emerald-200">
                  3
                </div>
                <div className="text-xs font-bold text-slate-900 mb-1">NEGOTIATE</div>
                <p className="text-[11px] text-slate-500 leading-snug">Filter buyers & lock target price.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center mb-2 font-bold text-xs border border-teal-200">
                  4
                </div>
                <div className="text-xs font-bold text-slate-900 mb-1">HANDOVER</div>
                <p className="text-[11px] text-slate-500 leading-snug">Collect payment & earn commission.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-600 text-sm sm:text-base">Three simple steps to launch your personalized starter system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-lg mb-4 border border-teal-200">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tell Us About Yourself</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Answer 5 quick onboarding questions about your location, seller contacts, and time availability (takes ~2 minutes).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg mb-4 border border-amber-200">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Build Your Starter System</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Gemini AI crafts custom business name ideas, WhatsApp bio, copy-paste outreach scripts, and a 7-day launch plan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-lg mb-4 border border-teal-200">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Start Finding Your First Seller</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Copy your customized scripts, follow the 4-step checklist, and start reaching potential sellers without risking a single Naira.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE SECTION */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">What's Inside Your Free Kit?</h2>
            <p className="text-slate-600 text-sm sm:text-base">Everything you need to go from idea to your first seller inquiry.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-teal-500/40 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                <Smartphone className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Your Hustle Identity</h4>
              <p className="text-xs text-slate-600 leading-relaxed">5 tailored business name ideas + a trustworthy WhatsApp Business bio.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-teal-500/40 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Seller Outreach Scripts</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Ready-to-send messages for friends, family, estate groups, and referral requests.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-teal-500/40 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Listing Builder Template</h4>
              <p className="text-xs text-slate-600 leading-relaxed">A high-converting marketplace template plus a customized item listing example.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-teal-500/40 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">7-Day Launch Plan</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Daily micro-tasks guiding you step-by-step from setup to closing your first deal.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-teal-500/40 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">First Sale Checklist</h4>
              <p className="text-xs text-slate-600 leading-relaxed">The 4-step execution guide: Intake → List → Negotiate → Handover.</p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 hover:border-teal-500/40 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">AI Assistant Prompts</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Copy-paste prompts to help you write listings, research prices, and improve photo clarity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CREDIBILITY & ZERO CAPITAL PHILOSOPHY */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-50 to-teal-50/40 border border-teal-200 shadow-sm">
            <div className="inline-flex p-3 rounded-xl bg-teal-100 text-teal-800 mb-4 border border-teal-200">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">Why This Business Model Works</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              You don't need to buy products first. The model is based on connecting people who want to sell used items with people who want to buy them. You act as the trusted middleman agent and earn a commission on successful sales.
            </p>
            <div className="inline-block px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-500 text-xs font-mono shadow-xs">
              Disclaimer: Earnings depend on your execution, item demand, local market, and closing ability. We guarantee zero capital risk, not earnings.
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
            Ready To Launch Your Starter System?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Build your custom Zero-Naira Declutter Hustle Starter Kit in 3 minutes flat.
          </p>
          <button
            onClick={onStart}
            className="px-9 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-lg shadow-xl shadow-teal-500/20 transition-all transform active:scale-98 inline-flex items-center gap-2 cursor-pointer border border-amber-400/30"
          >
            <span>Build My Free Starter Kit</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 The Zero-Naira Declutter Hustle. Built for ambitious Nigerian entrepreneurs.</p>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-teal-700 hover:text-teal-900 font-semibold transition-colors cursor-pointer"
            >
              Owner Lead Portal & CRM →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
