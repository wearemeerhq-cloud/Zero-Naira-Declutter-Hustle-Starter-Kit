import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { OnboardingWizard } from './components/OnboardingWizard';
import { GenerationLoading } from './components/GenerationLoading';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { StarterKitDashboard } from './components/StarterKitDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfile, StarterKit, LeadData } from './types';
import { generateStarterKitApi } from './services/gemini';
import { submitLead, saveLocalProfileAndKit, getSavedSession, syncLeadsWithServer } from './services/leadService';
import { trackEvent } from './services/analytics';

export function App() {
  const [view, setView] = useState<'landing' | 'onboarding' | 'generating' | 'lead_capture' | 'dashboard' | 'admin'>('landing');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [starterKit, setStarterKit] = useState<StarterKit | null>(null);
  const [ebookUrl, setEbookUrl] = useState<string>('https://selar.co/zero-naira-declutter-hustle');
  const [savedKitAvailable, setSavedKitAvailable] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Fetch config and check saved session on load
  useEffect(() => {
    trackEvent('landing_page_view');
    syncLeadsWithServer();

    // Fetch config
    fetch('/api/config')
      .then(res => res.json())
      .then(cfg => {
        if (cfg.ebookPurchaseUrl) {
          setEbookUrl(cfg.ebookPurchaseUrl);
        }
      })
      .catch(() => {});

    // Check if user has a previously generated kit stored in localStorage
    const saved = getSavedSession();
    if (saved.profile && saved.kit) {
      setSavedKitAvailable(true);
    }
  }, []);

  const handleStartOnboarding = () => {
    trackEvent('starter_kit_started');
    setView('onboarding');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadSavedKit = () => {
    const saved = getSavedSession();
    if (saved.profile && saved.kit) {
      setProfile(saved.profile);
      setStarterKit(saved.kit);
      setView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOnboardingComplete = async (completedProfile: UserProfile) => {
    setProfile(completedProfile);
    setView('generating');
    setGenerationError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Pre-save lead record immediately
    const immediateLead: LeadData = {
      ...completedProfile,
      email: completedProfile.email || '',
      phone: completedProfile.phone || '',
      consent: true,
      createdAt: new Date().toISOString(),
      starterKitGenerated: true,
      ebookCtaViewed: false,
      ebookCtaClicked: false,
      status: 'new'
    };
    submitLead(immediateLead);

    try {
      const kit = await generateStarterKitApi(completedProfile);
      setStarterKit(kit);
      saveLocalProfileAndKit(completedProfile, kit);
      trackEvent('starter_kit_generated');

      // If user already provided email & phone, proceed straight to dashboard
      if (completedProfile.email && completedProfile.phone) {
        setView('dashboard');
        setSavedKitAvailable(true);
      } else {
        // Show lead capture modal to collect contact details
        setView('lead_capture');
      }
    } catch (err: any) {
      console.error('Generation failed:', err);
      setGenerationError(err?.message || 'Generation error. Please try again.');
    }
  };

  const handleLeadSubmit = async (leadData: LeadData) => {
    await submitLead(leadData);
    trackEvent('lead_submitted');
    setView('dashboard');
    setSavedKitAvailable(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-600 selection:text-white">
      
      {/* Universal Navigation Header */}
      <Navbar
        onStart={handleStartOnboarding}
        onOpenAdmin={() => setView('admin')}
        savedKitAvailable={savedKitAvailable}
        onLoadSavedKit={handleLoadSavedKit}
        ebookUrl={ebookUrl}
      />

      {/* VIEW ROUTING */}
      {view === 'landing' && (
        <LandingPage 
          onStart={handleStartOnboarding} 
          onOpenAdmin={() => setView('admin')}
          ebookUrl={ebookUrl} 
        />
      )}

      {view === 'onboarding' && (
        <OnboardingWizard
          onComplete={handleOnboardingComplete}
          onBackToHome={() => setView('landing')}
        />
      )}

      {view === 'generating' && (
        profile && (
          <div>
            {generationError ? (
              <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="text-xl font-bold text-red-400">Your starter kit couldn't be generated just yet.</div>
                <p className="text-sm text-slate-400 max-w-md">
                  Your answers are completely safe. Please try clicking below to retry.
                </p>
                <button
                  onClick={() => handleOnboardingComplete(profile)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <GenerationLoading firstName={profile.firstName} />
            )}
          </div>
        )
      )}

      {view === 'lead_capture' && profile && (
        <LeadCaptureModal
          profile={profile}
          onSubmitLead={handleLeadSubmit}
        />
      )}

      {view === 'dashboard' && profile && starterKit && (
        <StarterKitDashboard
          profile={profile}
          kit={starterKit}
          ebookUrl={ebookUrl}
          onOpenEbookCta={() => {
            trackEvent('ebook_cta_viewed');
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }}
        />
      )}

      {view === 'admin' && (
        <AdminDashboard onBack={() => setView('landing')} />
      )}

    </div>
  );
}

export default App;
