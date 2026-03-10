import { motion } from 'motion/react';
import { CircleCheck as CheckCircle2, Circle, ArrowRight, Grid3x3, Keyboard, Mail, Search, KeyRound } from 'lucide-react';
import { playSound } from '../services/soundService';

interface GameCardProps {
  key?: number | string;
  game: {
    id: number;
    title: string;
    desc: string;
    icon: string;
  };
  isCompleted: boolean;
  codePiece: string;
  onOpen: () => void;
}

const iconMap: { [key: string]: any } = {
  Grid3x3,
  Keyboard,
  Mail,
  Search,
  KeyRound
};

export function GameCard({ game, isCompleted, codePiece, onOpen }: GameCardProps) {
  const Icon = iconMap[game.icon] || Grid3x3;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-white p-4 rounded-[18px] shadow-md border transition-all ${isCompleted ? 'border-[#19E196]/30' : 'border-black/5'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl shrink-0 ${isCompleted ? 'bg-[#19E196]/10 text-[#19E196]' : 'bg-[#20126E]/10 text-[#20126E]'}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm mb-0.5 truncate">{game.title}</h4>
          <p className="text-xs text-gray-500 line-clamp-1">{game.desc}</p>
        </div>

        {isCompleted ? (
          <div className="flex flex-col items-end gap-1 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-[#19E196]" />
            <div className="px-1.5 py-0.5 bg-[#20126E] text-white text-[10px] font-bold rounded shadow-sm">
              {codePiece}
            </div>
          </div>
        ) : (
          <Circle className="w-5 h-5 text-gray-200 shrink-0" />
        )}
      </div>

      <button
        onClick={() => {
          playSound('cardOpen');
          onOpen();
        }}
        onMouseEnter={() => playSound('hover', 0.2)}
        className={`w-full mt-3 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
          isCompleted
            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            : 'bg-[#20126E] text-white hover:bg-[#1a0f5a] shadow-md'
        }`}
      >
        {isCompleted ? 'Opnieuw' : 'Open'}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
