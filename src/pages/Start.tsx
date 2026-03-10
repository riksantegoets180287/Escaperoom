import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu } from 'lucide-react';

interface StartProps {
  onStart: (name: string, className: string) => void;
}

export function Start({ onStart }: StartProps) {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [errors, setErrors] = useState<{ name?: string; className?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; className?: string } = {};
    if (!name.trim()) newErrors.name = 'Vul je naam in.';
    if (!className.trim()) newErrors.className = 'Vul je klas in.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onStart(name, className);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[22px] shadow-xl max-w-md w-full border border-black/5"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#20126E] p-4 rounded-2xl mb-4">
            <Cpu className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#20126E] text-center font-serif">Operation Virusvrij</h1>
          <p className="text-gray-500 text-center mt-2">Red de supercomputer van het virus!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#20126E] outline-none transition-all`}
              placeholder="Je volledige naam"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Klas</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border ${errors.className ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#20126E] outline-none transition-all`}
              placeholder="Bijv. ICT-1A"
            />
            {errors.className && <p className="text-red-500 text-xs mt-1">{errors.className}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#20126E] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a0f5a] transition-colors shadow-lg active:scale-[0.98]"
          >
            Start missie
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          Summa College &copy; 2026
        </p>
      </motion.div>
    </div>
  );
}
