import { useState, useEffect, useRef } from 'react';
import { useShortcut } from '../hooks/useShortcut';
import { playSound } from '../services/soundService';
import confetti from 'canvas-confetti';

interface Game2TypingProps {
  config: {
    targetText: string;
    passPercent: number;
    minWords: number;
  };
  onComplete: () => void;
}

export function Game2Typing({ config, onComplete }: Game2TypingProps) {
  const [input, setInput] = useState('');
  const [accuracy, setAccuracy] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useShortcut('8', 5, onComplete);

  useEffect(() => {
    const calculateAccuracy = () => {
      if (input.length === 0) return 0;
      
      let correct = 0;
      const minLen = Math.min(input.length, config.targetText.length);
      
      for (let i = 0; i < minLen; i++) {
        if (input[i] === config.targetText[i]) {
          correct++;
        }
      }
      
      return Math.round((correct / config.targetText.length) * 100);
    };

    setAccuracy(calculateAccuracy());
  }, [input, config.targetText]);

  const handleSubmit = () => {
    if (accuracy >= config.passPercent) {
      setIsFinished(true);
      playSound('gameComplete');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#20126E', '#FFC800', '#19E196']
      });
      setTimeout(onComplete, 1500);
    } else {
      setError(`Nauwkeurigheid te laag (${accuracy}%). Je hebt minimaal ${config.passPercent}% nodig.`);
      playSound('fail');
      setInput('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 p-6 bg-gray-50 rounded-2xl border border-gray-200 font-mono text-sm leading-relaxed select-none">
        {config.targetText.split('').map((char, i) => {
          let color = 'text-gray-400';
          if (i < input.length) {
            color = input[i] === char ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
          }
          return <span key={i} className={color}>{char}</span>;
        })}
      </div>

      <div className="space-y-4">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            playSound('typing');
            setError(null);
          }}
          className="w-full h-40 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-[#20126E] outline-none font-mono text-sm resize-none"
          placeholder="Begin hier met typen..."
          disabled={isFinished}
        />

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="text-sm">
              <span className="text-gray-400 uppercase font-bold text-[10px] block">Nauwkeurigheid</span>
              <span className={`text-xl font-bold ${accuracy >= config.passPercent ? 'text-green-600' : 'text-[#20126E]'}`}>
                {accuracy}%
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-400 uppercase font-bold text-[10px] block">Doel</span>
              <span className="text-xl font-bold text-gray-400">{config.passPercent}%</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isFinished || input.length < config.targetText.length * 0.5}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              isFinished 
                ? 'bg-green-500 text-white' 
                : 'bg-[#20126E] text-white hover:bg-[#1a0f5a] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isFinished ? 'Geverifieerd!' : 'Check Code'}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-sm font-bold text-center animate-bounce">{error}</p>
        )}
        
        <p className="text-xs text-gray-400 text-center italic">
          Let op hoofdletters, cijfers en vreemde tekens.
        </p>
      </div>
    </div>
  );
}
