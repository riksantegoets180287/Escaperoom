import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useShortcut } from '../hooks/useShortcut';
import { playSound } from '../services/soundService';
import confetti from 'canvas-confetti';

interface Game1PatternProps {
  config: {
    gridSize: number;
    patternLength: number;
    maxAttempts: number;
  };
  onComplete: () => void;
}

export function Game1Pattern({ config, onComplete }: Game1PatternProps) {
  const [round, setRound] = useState(1);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'success' | 'fail'>('idle');
  const [attempts, setAttempts] = useState(0);
  const [highlightedCell, setHighlightedCell] = useState<number | null>(null);

  useShortcut('8', 5, onComplete);

  const getRoundConfig = (r: number) => {
    switch (r) {
      case 1: return { size: 3, length: 3 };
      case 2: return { size: 4, length: 4 };
      case 3: return { size: 5, length: 5 };
      case 4: return { size: 6, length: 6 };
      default: return { size: 3, length: 3 };
    }
  };

  const currentRoundConfig = getRoundConfig(round);

  const generatePattern = useCallback(() => {
    const { size, length } = getRoundConfig(round);
    const newPattern = [];
    for (let i = 0; i < length; i++) {
      newPattern.push(Math.floor(Math.random() * (size * size)));
    }
    setPattern(newPattern);
    setGameState('showing');
  }, [round]);

  useEffect(() => {
    if (gameState === 'showing') {
      let i = 0;
      const interval = setInterval(() => {
        if (i < pattern.length) {
          setHighlightedCell(pattern[i]);
          playSound('click');
          setTimeout(() => setHighlightedCell(null), 600);
          i++;
        } else {
          clearInterval(interval);
          setGameState('playing');
          setUserInput([]);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, pattern]);

  const handleCellClick = (index: number) => {
    if (gameState !== 'playing') return;

    const nextInput = [...userInput, index];
    setUserInput(nextInput);

    // Check if correct so far
    if (index !== pattern[userInput.length]) {
      setGameState('fail');
      playSound('fail');
      setAttempts(prev => prev + 1);
      return;
    }

    playSound('click');

    if (nextInput.length === pattern.length) {
      playSound('success');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#20126E', '#FFC800', '#19E196']
      });
      if (round < 4) {
        setGameState('success');
        setTimeout(() => {
          setRound(prev => prev + 1);
          setGameState('idle');
          setUserInput([]);
        }, 1500);
      } else {
        setGameState('success');
        playSound('complete');
        setTimeout(onComplete, 1500);
      }
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setUserInput([]);
    if (attempts >= config.maxAttempts) {
      setAttempts(0);
    }
  };

  return (
    <div className="flex flex-col items-center max-h-[70vh] justify-center">
      <div className="mb-3 text-center">
        <div className="inline-block px-2.5 py-1 bg-blue-100 text-[#20126E] rounded-full text-[10px] font-bold mb-1 uppercase tracking-wider">
          Patroon {round} van 4
        </div>
        <p className="text-gray-600 mb-1 text-xs leading-tight">
          {gameState === 'idle' && 'Klik op start om het patroon te zien.'}
          {gameState === 'showing' && 'Kijk goed naar het patroon...'}
          {gameState === 'playing' && `Klik de cellen in de juiste volgorde (${userInput.length}/${pattern.length})`}
          {gameState === 'success' && (round < 4 ? 'Goed! Op naar het volgende patroon...' : 'Geweldig! Alle patronen geverifieerd.')}
          {gameState === 'fail' && 'Fout patroon! Probeer het opnieuw.'}
        </p>
        <div className="text-[10px] font-bold text-gray-400">Poging: {attempts}/{config.maxAttempts}</div>
      </div>

      <div
        className="grid gap-1.5 bg-gray-100 p-2.5 rounded-2xl shadow-inner touch-none select-none"
        style={{
          gridTemplateColumns: `repeat(${currentRoundConfig.size}, minmax(0, 1fr))`,
          width: 'min(100%, 280px)',
          aspectRatio: '1/1'
        }}
      >
        {[...Array(currentRoundConfig.size * currentRoundConfig.size)].map((_, i) => (
          <motion.button
            key={`${round}-${i}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCellClick(i)}
            className={`rounded-md transition-all ${
              highlightedCell === i
                ? 'bg-[#FFC800] shadow-[0_0_15px_#FFC800]'
                : userInput.includes(i) && pattern[userInput.indexOf(i)] === i
                  ? 'bg-[#19E196]'
                  : 'bg-white hover:bg-gray-50'
            } ${gameState === 'fail' && userInput.includes(i) ? 'bg-[#DC1E50]' : ''}`}
            disabled={gameState !== 'playing'}
          />
        ))}
      </div>

      <div className="mt-5 flex gap-3">
        {gameState === 'idle' && (
          <button
            onClick={generatePattern}
            onMouseEnter={() => playSound('hover', 0.2)}
            className="bg-[#20126E] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-[#1a0f5a] transition-all"
          >
            Start Patroon
          </button>
        )}
        {(gameState === 'fail' || gameState === 'playing') && (
          <button
            onClick={resetGame}
            onMouseEnter={() => playSound('hover', 0.2)}
            className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-300 transition-all"
          >
            Opnieuw
          </button>
        )}
      </div>

      {attempts >= 2 && gameState === 'playing' && (
        <p className="mt-3 text-[10px] text-blue-500 italic">Hint: Kijk goed naar de eerste 3 klikken.</p>
      )}
    </div>
  );
}
