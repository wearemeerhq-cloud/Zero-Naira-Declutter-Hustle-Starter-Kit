import React, { useState } from 'react';
import { LeadData, UserProfile } from '../types';
import { CheckCircle2, Lock, ArrowRight, AlertCircle, Mail, Phone, User } from 'lucide-react';

interface LeadCaptureModalProps {
  profile: UserProfile;
  onSubmitLead: (leadData: LeadData) => void;
  onSkipOrDismiss?: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  profile,
  onSubmitLead,
}) => {
  const [firstName, setFirstName] = useState(profile.firstName || '');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) {
      setError('Please provide your name.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 10) {
      setError('Please enter a valid WhatsApp phone number (at least 10 digits).');
      return;
    }

    setIsSubmitting(true);

    const leadData: LeadData = {
      ...profile,
      firstName,
      email: email.trim(),
      phone: phone.trim(),
      consent,
      createdAt: new Date().toISOString(),
      starterKitGenerated: true,
      ebookCtaViewed: false,
      ebookCtaClicked: false,
    };

    onSubmitLead(leadData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl relative animate-scaleUp">
        
        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-6 h-6 text-amber-500" />
        </div>

        <div className="mb-6">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
            STARTER KIT: 100% READY
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Where should we send your personalized kit?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Enter your details below to unlock your custom business names, outreach scripts, 7-day plan, and PDF download.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              First Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              WhatsApp Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 08012345678 or +234..."
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs text-slate-600 leading-snug">
                Send me useful tips and templates for finding sellers and buyers in Nigeria.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer border border-teal-500/30"
          >
            {isSubmitting ? (
              <span>Unlocking Your Kit...</span>
            ) : (
              <>
                <span>Get My Starter Kit</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Your information is 100% private and secure. No spam ever.</span>
        </div>
      </div>
    </div>
  );
};
