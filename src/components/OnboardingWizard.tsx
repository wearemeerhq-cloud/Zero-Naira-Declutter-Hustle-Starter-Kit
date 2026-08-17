import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, ArrowLeft, Check, Sparkles, AlertCircle } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (profile: UserProfile) => void;
  onBackToHome: () => void;
}

const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Kaduna', 'Enugu', 'Anambra', 
  'Edo', 'Ogun', 'Delta', 'Osun', 'Ondo', 'Akwa Ibom', 'Kwara', 'Imo', 'Abia', 
  'Plateau', 'Benue', 'Cross River', 'Kogi', 'Borno', 'Gombe', 'Bauchi', 'Adamawa', 
  'Bayelsa', 'Ekiti', 'Jigawa', 'Katsina', 'Kebbi', 'Nasarawa', 'Niger', 'Sokoto', 
  'Taraba', 'Yobe', 'Zamfara'
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onBackToHome }) => {
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>('');

  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    email: '',
    phone: '',
    city: '',
    state: 'Lagos',
    area: '',
    experienceLevel: "I'm completely new to selling",
    startingCapital: '₦0',
    sellerAccess: ['Friends', 'Family', 'Estate/community groups'],
    itemCategories: ['Appliances', 'Electronics', 'Phones/laptops'],
    customCategory: '',
    primaryGoal: 'Get my first seller',
    availableTime: '3–5 hours'
  });

  const updateField = (key: keyof UserProfile, value: any) => {
    setError('');
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: 'sellerAccess' | 'itemCategories', item: string) => {
    setError('');
    setProfile(prev => {
      const current = prev[key] || [];
      if (current.includes(item)) {
        return { ...prev, [key]: current.filter(i => i !== item) };
      } else {
        return { ...prev, [key]: [...current, item] };
      }
    });
  };

  const validateStep = () => {
    if (step === 1) {
      if (!profile.firstName.trim()) {
        setError('Please enter your first name.');
        return false;
      }
      if (!profile.city.trim()) {
        setError('Please enter your city/town.');
        return false;
      }
      if (profile.email && !profile.email.includes('@')) {
        setError('Please enter a valid email address.');
        return false;
      }
    }
    if (step === 3) {
      if (!profile.sellerAccess || profile.sellerAccess.length === 0) {
        setError('Please select at least one network you can potentially reach.');
        return false;
      }
    }
    if (step === 4) {
      if (!profile.itemCategories || profile.itemCategories.length === 0) {
        setError('Please select at least one item category.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 5) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBackToHome();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-teal-700 uppercase mb-2">
            <span>STEP {step} OF 5</span>
            <span className="text-amber-600 font-bold">{step * 20}% COMPLETED</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/50">
            <div 
              className="h-full bg-gradient-to-r from-teal-600 via-teal-500 to-amber-500 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${step * 20}%` }}
            />
          </div>
        </div>

        {/* Validation Error Message */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: ABOUT YOU */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Let's set up your profile</h2>
              <p className="text-xs sm:text-sm text-slate-600">Where will you be operating your declutter hustle?</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                What should we call you? *
              </label>
              <input
                type="text"
                placeholder="e.g. Chidi, Tolu, or Blessing"
                value={profile.firstName}
                onChange={e => updateField('firstName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 text-sm transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@gmail.com"
                  value={profile.email || ''}
                  onChange={e => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  WhatsApp Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 08012345678"
                  value={profile.phone || ''}
                  onChange={e => updateField('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 text-sm transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  City / Town *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ikeja, Wuse, Port Harcourt"
                  value={profile.city}
                  onChange={e => updateField('city', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  State *
                </label>
                <select
                  value={profile.state}
                  onChange={e => updateField('state', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:bg-white focus:border-teal-600 text-sm transition-colors"
                >
                  {NIGERIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Neighborhood / Estate (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Yaba, Garki, GRA Phase 2"
                value={profile.area}
                onChange={e => updateField('area', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 text-sm transition-colors"
              />
            </div>
          </div>
        )}

        {/* STEP 2: YOUR STARTING POINT */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Your Starting Point</h2>
              <p className="text-xs sm:text-sm text-slate-600">Help us customize your starter scripts to your experience.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Which best describes you?
              </label>
              <div className="space-y-2.5">
                {[
                  "I'm completely new to selling",
                  "I've sold things before",
                  "I already sell products/services",
                  "I help people sell things occasionally"
                ].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => updateField('experienceLevel', opt)}
                    className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      profile.experienceLevel === opt
                        ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {profile.experienceLevel === opt && <Check className="w-4 h-4 text-teal-600 shrink-0 font-bold" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                How much money are you comfortable starting with?
              </label>
              <p className="text-[11px] text-amber-700 mb-3 font-medium">
                Note: Capital is ₦0 required for the middleman model, but this helps gauge your comfort level.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {['₦0', 'Under ₦5,000', '₦5,000–₦20,000', 'More than ₦20,000'].map(cap => (
                  <button
                    key={cap}
                    type="button"
                    onClick={() => updateField('startingCapital', cap)}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      profile.startingCapital === cap
                        ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cap}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SELLER ACCESS */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Your Access to Sellers</h2>
              <p className="text-xs sm:text-sm text-slate-600">Who could you potentially reach out to first? (Select all that apply)</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'Friends',
                'Family',
                'Colleagues',
                'Neighbours',
                'Estate/community groups',
                'Church/mosque groups',
                'Alumni/school groups',
                'Social media audience',
                "I don't have anyone in mind yet"
              ].map(net => {
                const isSelected = profile.sellerAccess.includes(net);
                return (
                  <button
                    key={net}
                    type="button"
                    onClick={() => toggleArrayItem('sellerAccess', net)}
                    className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{net}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: WHAT YOU WANT TO SELL */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Item Categories</h2>
              <p className="text-xs sm:text-sm text-slate-600">What types of used items are you most interested in helping people sell?</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                'Furniture',
                'Appliances',
                'Electronics',
                'Kitchen/household items',
                'Baby/kids items',
                'Generators',
                'Phones/laptops',
                'Other'
              ].map(cat => {
                const isSelected = profile.itemCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleArrayItem('itemCategories', cat)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {profile.itemCategories.includes('Other') && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Specify Custom Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Office chairs, Solar panels, Musical gear"
                  value={profile.customCategory || ''}
                  onChange={e => updateField('customCategory', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 text-sm"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 5: YOUR GOAL */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">Your Primary Goal</h2>
              <p className="text-xs sm:text-sm text-slate-600">What do you want to accomplish first?</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                First Goal
              </label>
              <div className="space-y-2">
                {[
                  'Get my first seller',
                  'Get my first item listed',
                  'Find my first buyer',
                  'Make my first commission',
                  'Build this into a side hustle',
                  "I'm just exploring the idea"
                ].map(goal => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => updateField('primaryGoal', goal)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                      profile.primaryGoal === goal
                        ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{goal}</span>
                    {profile.primaryGoal === goal && <Check className="w-4 h-4 text-teal-600 shrink-0 font-bold" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                How much time can you give this each week?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {['1–3 hours', '3–5 hours', '5–10 hours', '10+ hours'].map(time => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => updateField('availableTime', time)}
                    className={`p-3 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      profile.availableTime === time
                        ? 'bg-teal-50 border-teal-600 text-teal-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all transform active:scale-98 cursor-pointer border border-teal-500/30"
          >
            <span>{step === 5 ? 'Generate My Starter Kit' : 'Continue'}</span>
            {step === 5 ? <Sparkles className="w-4 h-4 text-amber-300" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
};
