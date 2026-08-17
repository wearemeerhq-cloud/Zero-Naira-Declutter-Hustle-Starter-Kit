import React, { useState } from 'react';
import { StarterKit, UserProfile } from '../types';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  ChevronRight, 
  CheckSquare, 
  Square, 
  Info, 
  MessageSquare, 
  Smartphone, 
  ShoppingBag, 
  Calendar, 
  Target, 
  ShieldCheck, 
  Bot, 
  Zap, 
  ArrowRight,
  Send,
  BookOpen
} from 'lucide-react';
import { downloadStarterKitPDF } from '../services/pdfService';
import { EbookCTA } from './EbookCTA';

interface StarterKitDashboardProps {
  profile: UserProfile;
  kit: StarterKit;
  ebookUrl: string;
  onOpenEbookCta: () => void;
}

export const StarterKitDashboard: React.FC<StarterKitDashboardProps> = ({
  profile,
  kit,
  ebookUrl,
  onOpenEbookCta,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [missionModalOpen, setMissionModalOpen] = useState(false);
  const [missionCompleted, setMissionCompleted] = useState(false);

  // Checkbox state tracking for 7-day plan, prospects, and checklists
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCompletedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadPDF = () => {
    downloadStarterKitPDF(profile, kit, ebookUrl);
  };

  const handleShareWhatsApp = () => {
    const shareText = `I just built my free Zero-Naira Hustle Starter Kit! Turn unused household items into potential commission opportunities without buying stock. Build yours here: ${window.location.origin}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* HEADER BANNER */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-10 px-4 sm:px-6 shadow-xs">
        <div className="max-w-5xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
                <Check className="w-3.5 h-3.5 text-teal-600 font-bold" />
                <span>Starter Kit: 100% Ready</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
                {profile.firstName || 'ENTREPRENEUR'}'S ZERO-NAIRA HUSTLE STARTER KIT
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                Your personalized starting point for {profile.city}, {profile.state}
              </p>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 border border-teal-500/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-teal-700" />
                <span className="hidden sm:inline">Share on WhatsApp</span>
                <span className="sm:hidden">Share</span>
              </button>
            </div>
          </div>

          {/* User Profile Summary Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-700">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-medium">
              📍 {profile.city}, {profile.state}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-medium">
              🎯 {profile.primaryGoal}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-medium">
              ⏱️ {profile.availableTime}/week
            </span>
          </div>

        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-8">

        {/* SECTION 1: HUSTLE IDENTITY */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Your Hustle Identity</h2>
              <p className="text-xs text-slate-600">Business names & WhatsApp profile bio for your local launch</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommended Business Name */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Recommended Name Option
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-teal-500/40 relative">
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  TOP PICK
                </span>
                <div className="text-lg font-extrabold text-slate-900">
                  {kit.businessIdentity.recommendedName}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {kit.businessIdentity.businessPositioning}
                </p>
              </div>

              <div className="text-xs font-semibold text-slate-600 mt-4 mb-2">
                Alternative Name Options:
              </div>
              <div className="space-y-2">
                {kit.businessIdentity.businessNames.map((bn, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-900">{bn.name}</span>
                    <span className="text-slate-600 block text-[11px] mt-0.5">{bn.positioning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Business Bio */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  WhatsApp Business Bio
                </div>
                <button
                  onClick={() => copyToClipboard(kit.businessIdentity.whatsappBio, 'bio')}
                  className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'bio' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-600 font-bold" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Bio</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono relative">
                {kit.businessIdentity.whatsappBio}
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 leading-snug flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Tip: Use WhatsApp Business (Free) to set up catalog items for available household goods.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SELLER OUTREACH KIT */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Your Seller Outreach Kit</h2>
              <p className="text-xs text-slate-600">Copy-and-paste scripts to find your first sellers without stress</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Script A */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  A. Personal Contact Message (Friends / Family)
                </span>
                <button
                  onClick={() => copyToClipboard(kit.sellerOutreach.personalContact, 'script_a')}
                  className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-xs text-slate-800 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedKey === 'script_a' ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'script_a' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {kit.sellerOutreach.personalContact}
              </p>
            </div>

            {/* Script B */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  B. Community / Estate Group Post (WhatsApp / Facebook)
                </span>
                <button
                  onClick={() => copyToClipboard(kit.sellerOutreach.communityGroup, 'script_b')}
                  className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-xs text-slate-800 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedKey === 'script_b' ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'script_b' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {kit.sellerOutreach.communityGroup}
              </p>
            </div>

            {/* Script C */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  C. Referral Request Message
                </span>
                <button
                  onClick={() => copyToClipboard(kit.sellerOutreach.referralMessage, 'script_c')}
                  className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-xs text-slate-800 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedKey === 'script_c' ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'script_c' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                {kit.sellerOutreach.referralMessage}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: LISTING TEMPLATE */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Your First Listing Template</h2>
              <p className="text-xs text-slate-600">Honest, clear marketplace templates that build buyer trust</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reusable Template Structure */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                  Reusable Listing Template
                </span>
                <button
                  onClick={() => copyToClipboard(kit.listingTemplate, 'list_temp')}
                  className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'list_temp' ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                {kit.listingTemplate}
              </pre>
            </div>

            {/* Customized Category Example */}
            <div className="p-4 rounded-xl bg-slate-50 border border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Example: {profile.itemCategories?.[0] || 'Household'} Listing
                </span>
                <button
                  onClick={() => copyToClipboard(kit.exampleListing, 'list_ex')}
                  className="text-xs text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === 'list_ex' ? <Check className="w-3.5 h-3.5 text-teal-700" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="text-xs text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                {kit.exampleListing}
              </pre>
            </div>
          </div>
        </section>

        {/* SECTION 4: COMMISSION STARTER GUIDE */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Your Commission Starter Guide</h2>
              <p className="text-xs text-slate-600">How to price your agent fee and lock terms before listing</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                Recommended Structure: {kit.commissionGuide.recommendedModel}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                {kit.commissionGuide.explanation}
              </p>
              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900 font-mono">
                {kit.commissionGuide.startingFramework}
              </div>
            </div>

            {/* 5 Terms to Agree in Writing */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                ✓ 5 Mandatory Terms to Agree in Writing Before Listing:
              </h4>
              <div className="space-y-2">
                {kit.commissionGuide.importantTerms.map((term, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-teal-700 shrink-0 mt-0.5 font-bold" />
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Link to Ebook Sales Page */}
            <div className="pt-2 text-center">
              <a
                href={ebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Want the complete pricing and negotiation system? Visit the full Ebook Sales Page ↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 5: 7-DAY ACTION PLAN */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              5
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Your 7-Day Action Plan</h2>
              <p className="text-xs text-slate-600">Step-by-step daily micro-tasks to launch your hustle</p>
            </div>
          </div>

          <div className="space-y-4">
            {kit.sevenDayPlan.map((dayPlan) => (
              <div key={dayPlan.day} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 border border-teal-200 text-teal-800">
                    DAY {dayPlan.day}: {dayPlan.title.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 italic">
                  Objective: {dayPlan.objective}
                </p>

                <div className="space-y-2 pt-1">
                  {dayPlan.actions.map((act, idx) => {
                    const actId = `day_${dayPlan.day}_act_${idx}`;
                    const isChecked = !!completedActions[actId];

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleCheck(actId)}
                        className={`p-2.5 rounded-lg border text-xs flex items-center gap-3 cursor-pointer transition-colors ${
                          isChecked 
                            ? 'bg-teal-50 border-teal-300 text-teal-900 line-through opacity-80' 
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-amber-600 shrink-0 font-bold" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span>{act}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: FIRST 10 PROSPECTS */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              6
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Your First 10 Prospects</h2>
              <p className="text-xs text-slate-600">Target categories based on your initial network access</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {kit.prospectIdeas.map((idea, idx) => {
              const prospectId = `prospect_${idx}`;
              const isChecked = !!completedActions[prospectId];

              return (
                <div
                  key={idx}
                  onClick={() => toggleCheck(prospectId)}
                  className={`p-3 rounded-xl border text-xs flex items-center gap-3 cursor-pointer transition-colors ${
                    isChecked 
                      ? 'bg-teal-50 border-teal-300 text-teal-900 line-through opacity-80' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-amber-600 shrink-0 font-bold" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span><strong className="text-slate-900">#{idx + 1}:</strong> {idea}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 7: FIRST SALE CHECKLIST */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              7
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">First Sale Execution Checklist</h2>
              <p className="text-xs text-slate-600">Follow the 4-step middleman sales cycle</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Intake */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-teal-700 uppercase tracking-wider mb-2">
                1. INTAKE
              </div>
              {kit.firstSaleChecklist.intake.map((item, idx) => {
                const id = `intake_${idx}`;
                const isChecked = !!completedActions[id];
                return (
                  <div key={idx} onClick={() => toggleCheck(id)} className="flex items-start gap-2 text-xs text-slate-800 cursor-pointer">
                    {isChecked ? <CheckSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                    <span className={isChecked ? 'line-through text-slate-400' : ''}>{item}</span>
                  </div>
                );
              })}
            </div>

            {/* List */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                2. LIST
              </div>
              {kit.firstSaleChecklist.list.map((item, idx) => {
                const id = `list_${idx}`;
                const isChecked = !!completedActions[id];
                return (
                  <div key={idx} onClick={() => toggleCheck(id)} className="flex items-start gap-2 text-xs text-slate-800 cursor-pointer">
                    {isChecked ? <CheckSquare className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                    <span className={isChecked ? 'line-through text-slate-400' : ''}>{item}</span>
                  </div>
                );
              })}
            </div>

            {/* Negotiate */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                3. NEGOTIATE
              </div>
              {kit.firstSaleChecklist.negotiate.map((item, idx) => {
                const id = `neg_${idx}`;
                const isChecked = !!completedActions[id];
                return (
                  <div key={idx} onClick={() => toggleCheck(id)} className="flex items-start gap-2 text-xs text-slate-800 cursor-pointer">
                    {isChecked ? <CheckSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                    <span className={isChecked ? 'line-through text-slate-400' : ''}>{item}</span>
                  </div>
                );
              })}
            </div>

            {/* Handover */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">
                4. HANDOVER
              </div>
              {kit.firstSaleChecklist.handover.map((item, idx) => {
                const id = `hand_${idx}`;
                const isChecked = !!completedActions[id];
                return (
                  <div key={idx} onClick={() => toggleCheck(id)} className="flex items-start gap-2 text-xs text-slate-800 cursor-pointer">
                    {isChecked ? <CheckSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                    <span className={isChecked ? 'line-through text-slate-400' : ''}>{item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 8: AI ASSISTANT PROMPTS */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center font-bold">
              8
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Your AI Assistant Prompts</h2>
              <p className="text-xs text-slate-600">Copy these prompts to use with free AI assistants like Gemini or Claude</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {kit.aiPrompts.map((promptItem, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                      {promptItem.title}
                    </span>
                    <button
                      onClick={() => copyToClipboard(promptItem.prompt, `prompt_${idx}`)}
                      className="text-xs text-teal-700 hover:text-teal-800 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === `prompt_${idx}` ? <Check className="w-3.5 h-3.5 text-amber-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-800 font-mono bg-white p-3 rounded-lg border border-slate-200 leading-relaxed mb-3">
                    "{promptItem.prompt}"
                  </p>
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  💡 {promptItem.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 9: YOUR NEXT MOVE */}
        <section className="bg-gradient-to-r from-teal-50 via-teal-50/50 to-amber-50/30 border border-teal-200 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-teal-600 text-white font-black text-sm uppercase tracking-wider border border-teal-500/30 shadow-xs">
              {kit.nextMove.heading}
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
              "{kit.nextMove.description}"
            </p>

            <div className="pt-2">
              <button
                onClick={() => setMissionModalOpen(true)}
                className="px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-base shadow-xl shadow-teal-600/20 border border-teal-500/30 transition-all transform active:scale-98 inline-flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-white text-white" />
                <span>I'M READY TO START</span>
              </button>
            </div>
          </div>
        </section>

        {/* PAID EBOOK CONVERSION CTA BANNER */}
        <EbookCTA ebookUrl={ebookUrl} />

      </div>

      {/* MISSION ACTION MODAL */}
      {missionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto font-black text-xl">
              🎯
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your First Mission</h3>
            <p className="text-sm text-slate-700 font-medium">
              "{kit.nextMove.actionMission}"
            </p>

            <p className="text-xs text-slate-600">
              Open WhatsApp right now and send Script A to 3 close contacts who might have unused items taking up space.
            </p>

            <div 
              onClick={() => setMissionCompleted(!missionCompleted)}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                missionCompleted ? 'bg-teal-50 border-teal-300 text-teal-900' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {missionCompleted ? <CheckSquare className="w-4 h-4 text-amber-600" /> : <Square className="w-4 h-4 text-slate-400" />}
              <span>I've contacted my first 3 prospects today!</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setMissionModalOpen(false)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider border border-teal-500/30 cursor-pointer"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
