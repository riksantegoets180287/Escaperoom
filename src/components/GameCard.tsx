import { motion } from 'motion/react';
import { CheckCircle2, Circle, ArrowRight, Grid3x3, Keyboard, Mail, Search, KeyRound } from 'lucide-react';

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
      whileHover={{ y: -4 }}
      className={`bg-white p-5 rounded-[22px] shadow-md border transition-all ${isCompleted ? 'border-[#19E196]/30' : 'border-black/5'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl ${isCompleted ? 'bg-[#19E196]/10 text-[#19E196]' : 'bg-[#20126E]/10 text-[#20126E]'}`}>
          <Icon className="w-6 h-6" />
        </div>
        {isCompleted ? (
          <div className="flex flex-col items-end">
            <CheckCircle2 className="w-6 h-6 text-[#19E196]" />
            <div className="mt-2 px-2 py-1 bg-[#20126E] text-white text-xs font-bold rounded-md shadow-sm">
              Code: {codePiece}
            </div>
          </div>
        ) : (
          <Circle className="w-6 h-6 text-gray-200" />
        )}
      </div>

      <h4 className="font-bold text-lg mb-1">{game.title}</h4>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{game.desc}</p>

      <button 
        onClick={onOpen}
        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          isCompleted 
            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' 
            : 'bg-[#20126E] text-white hover:bg-[#1a0f5a] shadow-md'
        }`}
      >
        {isCompleted ? 'Opnieuw Spelen' : 'Open Spel'}
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
