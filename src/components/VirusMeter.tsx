import { motion } from 'motion/react';
import { Grid3x3, Keyboard, Mail, Search, KeyRound } from 'lucide-react';

interface VirusMeterProps {
  completedCount: number;
  codePieces: { [key: number]: string };
  completedGames: { [key: number]: boolean };
  gameIcons: string[];
}

const iconMap: { [key: string]: any } = {
  Grid3x3,
  Keyboard,
  Mail,
  Search,
  KeyRound
};

export function VirusMeter({ completedCount, codePieces, completedGames, gameIcons }: VirusMeterProps) {
  const segments = [1, 2, 3, 4, 5, 6];

  return (
    <div className="bg-white p-6 rounded-[22px] shadow-lg border border-black/5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500">Virus Meter</h4>
        <span className={`text-sm font-bold ${completedCount === 6 ? 'text-[#19E196]' : 'text-[#DC1E50]'}`}>
          {completedCount === 6 ? 'Virus Weg' : `${6 - completedCount} Dreigingen`}
        </span>
      </div>

      <div className="flex gap-2 h-8 mb-8">
        {segments.map((s) => (
          <div
            key={s}
            className={`flex-1 rounded-md transition-all duration-500 ${
              s <= completedCount
                ? 'bg-[#19E196] shadow-[0_0_10px_rgba(25,225,150,0.3)]'
                : 'bg-[#DC1E50] opacity-20'
            }`}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4">
        {segments.map((s) => {
          const Icon = iconMap[gameIcons[s - 1]] || Grid3x3;
          return (
            <div key={s} className="flex flex-col items-center gap-2">
              <motion.div
                animate={{
                  scale: completedGames[s] ? 1 : 0.9,
                  opacity: completedGames[s] ? 1 : 0.5,
                  borderColor: completedGames[s] ? '#20126E' : '#E5E7EB'
                }}
                className={`w-12 h-16 rounded-lg border-2 flex items-center justify-center bg-gray-50 relative overflow-hidden`}
              >
                {completedGames[s] ? (
                  <span className="text-xl font-bold text-[#20126E]">
                    {codePieces[s]}
                  </span>
                ) : (
                  <Icon className="w-6 h-6 text-gray-300" />
                )}
              </motion.div>
              <span className="text-[10px] font-bold text-gray-400">SPEL {s}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
