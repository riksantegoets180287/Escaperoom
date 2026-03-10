import { motion } from 'motion/react';
import { Bug, ShieldCheck } from 'lucide-react';

interface SuperComputerProps {
  isFinished: boolean;
  completedCount: number;
}

export function SuperComputer({ isFinished, completedCount }: SuperComputerProps) {
  // Virus intensity decreases as completedCount increases
  const virusOpacity = Math.max(0, 1 - completedCount / 6);

  return (
    <div className="relative bg-white p-8 rounded-[22px] shadow-xl border border-black/5 overflow-hidden min-h-[300px] flex flex-col items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#20126E 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

      <motion.div 
        animate={{ 
          scale: isFinished ? [1, 1.05, 1] : 1,
          boxShadow: isFinished ? '0 0 40px rgba(25, 225, 150, 0.4)' : '0 0 0px rgba(0,0,0,0)'
        }}
        transition={{ duration: 2, repeat: isFinished ? Infinity : 0 }}
        className={`relative z-10 w-48 h-48 rounded-3xl flex items-center justify-center transition-colors duration-1000 ${isFinished ? 'bg-[#19E196]' : 'bg-[#20126E]'}`}
      >
        <div className="absolute inset-2 border-2 border-white/20 rounded-2xl" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full" />
        
        {isFinished ? (
          <ShieldCheck className="w-24 h-24 text-white" />
        ) : (
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/30 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 bg-white/10 rounded-full" />
            </div>
            {/* Pulsing bug overlay */}
            <motion.div
              animate={{ opacity: virusOpacity, scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Bug className="w-16 h-16 text-[#DC1E50]" />
            </motion.div>
          </div>
        )}
      </motion.div>

      <div className="mt-8 text-center z-10">
        <h3 className="text-2xl font-bold font-serif mb-2">Supercomputer Core</h3>
        <div className="flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full animate-pulse ${isFinished ? 'bg-[#19E196]' : 'bg-[#DC1E50]'}`} />
          <span className={`text-sm font-bold uppercase tracking-widest ${isFinished ? 'text-[#19E196]' : 'text-[#DC1E50]'}`}>
            {isFinished ? 'Systeem Veilig' : 'Virus Gedetecteerd'}
          </span>
        </div>
      </div>

      {/* Subtle digital rain effect when virus is active */}
      {!isFinished && (
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100 }}
              animate={{ y: 500 }}
              transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, ease: 'linear', delay: Math.random() * 2 }}
              className="absolute text-[10px] font-mono text-[#DC1E50]"
              style={{ left: `${i * 10}%` }}
            >
              {Math.random() > 0.5 ? '0' : '1'}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
