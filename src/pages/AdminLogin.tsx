import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, X } from 'lucide-react';
import { playSound } from '../services/soundService';

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

export function AdminLogin({ onLogin, onClose }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SARKSARK') {
      playSound('success');
      onLogin();
    } else {
      playSound('fail');
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#20126E]/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-[32px] shadow-2xl max-w-sm w-full relative"
      >
        <button 
          onClick={() => {
            playSound('click');
            onClose();
          }}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#20126E] p-4 rounded-2xl mb-4">
            <KeyRound className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#20126E] font-serif">Admin Login</h2>
          <p className="text-gray-500 text-sm text-center mt-2">Voer het administrator wachtwoord in.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={`w-full px-4 py-3 rounded-xl border-2 text-center text-xl tracking-widest outline-none transition-all ${
              error ? 'border-red-500 animate-shake' : 'border-gray-100 focus:border-[#20126E]'
            }`}
            placeholder="Wachtwoord"
          />
          
          <button
            type="submit"
            onClick={() => playSound('click')}
            className="w-full bg-[#20126E] text-white py-4 rounded-xl font-bold hover:bg-[#1a0f5a] transition-all shadow-lg"
          >
            Inloggen
          </button>
        </form>
      </motion.div>
    </div>
  );
}
