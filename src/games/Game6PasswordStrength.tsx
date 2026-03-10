import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Check, X, Eye, EyeOff } from 'lucide-react';
import { useShortcut } from '../hooks/useShortcut';
import { playSound } from '../services/soundService';

interface Game6PasswordStrengthProps {
  config: {
    showExample: boolean;
  };
  onComplete: () => void;
}

export function Game6PasswordStrength({ config, onComplete }: Game6PasswordStrengthProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useShortcut('8', 5, onComplete);

  const rules = [
    { id: 'length', label: 'Minimaal 12 tekens', check: (p: string) => p.length >= 12 },
    { id: 'caps', label: 'Minimaal 4 hoofdletters (A-Z)', check: (p: string) => (p.match(/[A-Z]/g) || []).length >= 4 },
    { id: 'numbers', label: 'Minimaal 2 cijfers (0-9)', check: (p: string) => (p.match(/[0-9]/g) || []).length >= 2 },
    { id: 'specials', label: 'Minimaal 3 vreemde tekens (!@#$%^&*())', check: (p: string) => (p.match(/[!@#$%^&*()]/g) || []).length >= 3 },
  ];

  const passwordsMatch = password !== '' && password === confirmPassword;
  const passedCount = rules.filter(r => r.check(password)).length;
  const allPassed = passedCount === rules.length && passwordsMatch;

  const handleCheck = () => {
    if (allPassed) {
      setIsFinished(true);
      playSound('success');
      setTimeout(onComplete, 1500);
    } else {
      playSound('fail');
    }
  };

  const preventPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
  };

  const togglePasswordVisibility = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(true);
    setTimeout(() => setter(false), 1000);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${allPassed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          {allPassed ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
        </div>
        <h3 className="text-xl font-bold mb-2">Maak een sterk wachtwoord</h3>
        <p className="text-sm text-gray-500">Om de supercomputer te beveiligen hebben we een onkraakbaar wachtwoord nodig dat je twee keer identiek moet invullen.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                playSound('typing');
              }}
              onPaste={preventPaste}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#20126E] outline-none text-center text-xl tracking-widest transition-all pr-14"
              placeholder="Wachtwoord"
              disabled={isFinished}
            />
            <button
              type="button"
              onMouseDown={() => togglePasswordVisibility(setShowPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#20126E]"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                playSound('typing');
              }}
              onPaste={preventPaste}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#20126E] outline-none text-center text-xl tracking-widest transition-all pr-14"
              placeholder="Bevestig Wachtwoord"
              disabled={isFinished}
            />
            <button
              type="button"
              onMouseDown={() => togglePasswordVisibility(setShowConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#20126E]"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                passedCount === 0 ? 'w-0' :
                passedCount < 2 ? 'w-1/4 bg-red-500' :
                passedCount < 4 ? 'w-2/4 bg-yellow-500' :
                'w-full bg-green-500'
              }`}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Zwak</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">Sterk</span>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-2xl space-y-3">
          {rules.map(rule => {
            const passed = rule.check(password);
            return (
              <div key={rule.id} className="flex items-center justify-between">
                <span className={`text-sm ${passed ? 'text-green-600 font-bold' : 'text-gray-500'}`}>{rule.label}</span>
                {passed ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-300" />}
              </div>
            );
          })}
          <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
            <span className={`text-sm ${passwordsMatch ? 'text-green-600 font-bold' : 'text-gray-500'}`}>Wachtwoorden komen overeen</span>
            {passwordsMatch ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-300" />}
          </div>
        </div>

        {config.showExample && (
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-xs text-yellow-800 italic">
            Voorbeeld format: ABCDxx12!@#yyyy
          </div>
        )}

        <button
          onClick={handleCheck}
          disabled={!allPassed || isFinished}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
            isFinished 
              ? 'bg-green-500 text-white' 
              : 'bg-[#20126E] text-white hover:bg-[#1a0f5a] disabled:opacity-50 disabled:cursor-not-allowed'
          }`}
        >
          {isFinished ? 'Wachtwoord Geaccepteerd!' : 'Activeer Beveiliging'}
        </button>
      </div>
    </div>
  );
}
