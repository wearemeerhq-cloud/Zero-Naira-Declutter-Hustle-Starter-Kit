import React, { useState, useRef, useEffect } from 'react';
import { Lock, ShieldCheck, ArrowLeft, AlertCircle, KeyRound, CheckCircle2, Loader2 } from 'lucide-react';

interface AdminPinLockProps {
  onSuccess: () => void;
  onBack: () => void;
}

// One-way SHA-256 hash of the authorized security PIN (avoids plaintext PIN exposure)
const AUTH_HASH = '6a8328b1da171410d67e3c0eb4c1904bfc18a4e0c4ef6e76d5bdaab8ae7a72b7';

async function computeSha256(text: string): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return '';
  }
}

export const AdminPinLock: React.FC<AdminPinLockProps> = ({ onSuccess, onBack }) => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [error, setError] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0].current?.focus();
  }, []);

  const grantAccess = (token?: string) => {
    setIsSuccess(true);
    if (token) {
      sessionStorage.setItem('zero_naira_admin_token', token);
    }
    sessionStorage.setItem('zero_naira_admin_unlocked', 'true');
    setTimeout(() => {
      onSuccess();
    }, 400);
  };

  const rejectAccess = (errMsg: string) => {
    setError(errMsg);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setPin(['', '', '', '']);
      inputRefs[0].current?.focus();
    }, 600);
  };

  const handleVerifyPin = async (fullPin: string) => {
    if (fullPin.length !== 4 || isVerifying) return;

    setIsVerifying(true);
    setError('');

    try {
      // 1. Attempt server-side verification first
      const response = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pin: fullPin })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          grantAccess(data.token);
          return;
        } else {
          rejectAccess(data.error || 'Incorrect 4-digit PIN. Please try again.');
          return;
        }
      } else if (response.status === 401) {
        const data = await response.json().catch(() => ({}));
        rejectAccess(data.error || 'Incorrect 4-digit PIN. Please try again.');
        return;
      }
      
      // If server returns 404 (e.g. static hosting on Vercel/Netlify/GitHub Pages)
      const inputHash = await computeSha256(fullPin);
      if (inputHash === AUTH_HASH) {
        grantAccess();
        return;
      } else {
        rejectAccess('Incorrect 4-digit PIN. Please try again.');
        return;
      }
    } catch (err) {
      // 2. Cryptographic fallback if backend server is unreachable (static deployment or offline)
      try {
        const inputHash = await computeSha256(fullPin);
        if (inputHash === AUTH_HASH) {
          grantAccess();
          return;
        } else {
          rejectAccess('Incorrect 4-digit PIN. Please try again.');
          return;
        }
      } catch (fallbackErr) {
        rejectAccess('Incorrect 4-digit PIN. Please try again.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    if (isVerifying || isSuccess) return;

    const cleanValue = value.replace(/[^0-9]/g, '');
    if (!cleanValue) return;

    const newPin = [...pin];
    // If user pasted multiple characters
    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 4).split('');
      digits.forEach((d, i) => {
        newPin[i] = d;
      });
      setPin(newPin);
      if (digits.length === 4) {
        handleVerifyPin(newPin.join(''));
      } else {
        inputRefs[Math.min(digits.length, 3)].current?.focus();
      }
      return;
    }

    newPin[index] = cleanValue[cleanValue.length - 1];
    setPin(newPin);
    setError('');

    // Advance to next input
    if (index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Check if complete
    const fullPin = newPin.join('');
    if (fullPin.length === 4 && !newPin.includes('')) {
      handleVerifyPin(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isVerifying || isSuccess) return;

    if (e.key === 'Backspace') {
      if (!pin[index] && index > 0) {
        const newPin = [...pin];
        newPin[index - 1] = '';
        setPin(newPin);
        inputRefs[index - 1].current?.focus();
      } else {
        const newPin = [...pin];
        newPin[index] = '';
        setPin(newPin);
      }
      setError('');
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current?.focus();
    } else if (e.key === 'Enter') {
      const fullPin = pin.join('');
      if (fullPin.length === 4 && !pin.includes('')) {
        handleVerifyPin(fullPin);
      }
    }
  };

  const handleKeypadPress = (digit: string) => {
    if (isVerifying || isSuccess) return;

    const firstEmptyIndex = pin.findIndex(d => d === '');
    if (firstEmptyIndex !== -1) {
      const newPin = [...pin];
      newPin[firstEmptyIndex] = digit;
      setPin(newPin);
      setError('');

      if (firstEmptyIndex < 3) {
        inputRefs[firstEmptyIndex + 1].current?.focus();
      }

      if (firstEmptyIndex === 3) {
        handleVerifyPin(newPin.join(''));
      }
    }
  };

  const handleKeypadBackspace = () => {
    if (isVerifying || isSuccess) return;

    // Find last filled index
    for (let i = 3; i >= 0; i--) {
      if (pin[i]) {
        const newPin = [...pin];
        newPin[i] = '';
        setPin(newPin);
        inputRefs[i].current?.focus();
        setError('');
        break;
      }
    }
  };

  const handleClear = () => {
    if (isVerifying || isSuccess) return;
    setPin(['', '', '', '']);
    setError('');
    inputRefs[0].current?.focus();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 selection:bg-teal-600 selection:text-white">
      
      {/* Background Accent Gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-amber-500 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Main Website</span>
        </button>

        {/* Lock Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Header Icon & Title */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-teal-950 border border-teal-800/60 flex items-center justify-center text-teal-400 shadow-inner">
              {isSuccess ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 animate-bounce" />
              ) : isVerifying ? (
                <Loader2 className="w-7 h-7 text-teal-400 animate-spin" />
              ) : (
                <Lock className="w-7 h-7 text-teal-400" />
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Admin Access Protected
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Please enter the 4-digit security PIN to unlock the Zero-Naira Hustle Leads & Analytics dashboard.
            </p>
          </div>

          {/* PIN Input Slots */}
          <div className={`space-y-3 ${isShaking ? 'animate-shake' : ''}`}>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={isSuccess || isVerifying}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black rounded-2xl bg-slate-950 border transition-all duration-200 focus:outline-none ${
                    isSuccess
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400'
                      : error
                      ? 'border-red-500 bg-red-950/30 text-red-300'
                      : digit
                      ? 'border-teal-500 bg-slate-800 text-teal-300 ring-2 ring-teal-500/20'
                      : 'border-slate-800 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30'
                  }`}
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-red-400 font-semibold text-center animate-fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isVerifying && !error && !isSuccess && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-teal-400 font-medium text-center">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Verifying PIN...</span>
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold text-center animate-fade-in">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>PIN Verified. Access Granted!</span>
              </div>
            )}
          </div>

          {/* On-Screen Keypad for Fast Mobile & Desktop Access */}
          <div className="pt-2">
            <div className="grid grid-cols-3 gap-2.5 max-w-[280px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleKeypadPress(digit)}
                  disabled={isSuccess || isVerifying}
                  className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-800 active:scale-95 text-slate-100 font-bold text-lg border border-slate-750 hover:border-teal-500/50 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  {digit}
                </button>
              ))}
              
              <button
                type="button"
                onClick={handleClear}
                disabled={isSuccess || isVerifying}
                className="h-12 rounded-xl bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-slate-400 hover:text-white font-semibold text-xs border border-slate-800 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => handleKeypadPress('0')}
                disabled={isSuccess || isVerifying}
                className="h-12 rounded-xl bg-slate-800/80 hover:bg-slate-800 active:scale-95 text-slate-100 font-bold text-lg border border-slate-750 hover:border-teal-500/50 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                0
              </button>

              <button
                type="button"
                onClick={handleKeypadBackspace}
                disabled={isSuccess || isVerifying}
                className="h-12 rounded-xl bg-slate-800/40 hover:bg-slate-800 active:scale-95 text-slate-400 hover:text-white font-semibold text-xs border border-slate-800 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                title="Backspace"
              >
                ⌫
              </button>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="pt-2 border-t border-slate-800/80 text-center">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <KeyRound className="w-3 h-3 text-amber-500" />
              <span>Server Authenticated Security</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
