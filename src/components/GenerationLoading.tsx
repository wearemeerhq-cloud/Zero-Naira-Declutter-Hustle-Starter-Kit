import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface GenerationLoadingProps {
  firstName: string;
  onFinishedAnimation?: () => void;
}

const STEPS = [
  'Analyzing your location & seller network profile...',
  'Building your hustle identity & brand name options...',
  'Writing copy-paste WhatsApp seller outreach scripts...',
  'Creating custom item marketplace listing templates...',
  'Structuring your 7-day action plan & prospect list...',
  'Putting your complete Starter Kit together...'
];

export const GenerationLoading: React.FC<GenerationLoadingProps> = ({ firstName }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-xl relative overflow-hidden">
        
        {/* Glowing Orbit Icon */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-teal-500/20 animate-ping" />
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 relative z-10 shadow-md">
            <Sparkles className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Generating {firstName}'s Starter Kit
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-8">
          Gemini AI is crafting your personalized Zero-Naira Declutter launch system...
        </p>

        {/* Step Progress List */}
        <div className="space-y-3 text-left max-w-sm mx-auto mb-8">
          {STEPS.map((stepText, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div 
                key={stepText}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 text-xs ${
                  isDone 
                    ? 'text-teal-800 bg-teal-50 border border-teal-200 font-medium' 
                    : isCurrent 
                      ? 'text-amber-800 bg-amber-50 border border-amber-300 font-semibold scale-[1.02]' 
                      : 'text-slate-400 opacity-50'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-500 italic">
          Takes approximately 3–6 seconds • Free AI-powered generation
        </div>
      </div>
    </div>
  );
};
