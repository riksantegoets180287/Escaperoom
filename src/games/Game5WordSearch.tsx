import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CircleCheck as CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShortcut } from '../hooks/useShortcut';
import { playSound } from '../services/soundService';

interface Game5WordSearchProps {
  config: {
    words: string[];
    gridSize: number;
  };
  onComplete: () => void;
}

export function Game5WordSearch({ config, onComplete }: Game5WordSearchProps) {
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [foundCells, setFoundCells] = useState<{ r: number, c: number }[]>([]);
  const [currentSelection, setCurrentSelection] = useState<{ r: number, c: number }[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  useShortcut('8', 5, onComplete);

  const generateGrid = useCallback(() => {
    const size = config.gridSize;
    const newGrid = Array(size).fill(null).map(() => Array(size).fill(''));
    const words = [...config.words].map(w => w.toUpperCase());

    // Place words
    words.forEach(word => {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const direction = Math.floor(Math.random() * 3); // 0: horiz, 1: vert, 2: diag
        const r = Math.floor(Math.random() * size);
        const c = Math.floor(Math.random() * size);

        let canPlace = true;
        if (direction === 0) { // Horiz
          if (c + word.length > size) canPlace = false;
          else {
            for (let i = 0; i < word.length; i++) {
              if (newGrid[r][c + i] !== '' && newGrid[r][c + i] !== word[i]) canPlace = false;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) newGrid[r][c + i] = word[i];
            placed = true;
          }
        } else if (direction === 1) { // Vert
          if (r + word.length > size) canPlace = false;
          else {
            for (let i = 0; i < word.length; i++) {
              if (newGrid[r + i][c] !== '' && newGrid[r + i][c] !== word[i]) canPlace = false;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) newGrid[r + i][c] = word[i];
            placed = true;
          }
        } else { // Diag
          if (r + word.length > size || c + word.length > size) canPlace = false;
          else {
            for (let i = 0; i < word.length; i++) {
              if (newGrid[r + i][c + i] !== '' && newGrid[r + i][c + i] !== word[i]) canPlace = false;
            }
          }
          if (canPlace) {
            for (let i = 0; i < word.length; i++) newGrid[r + i][c + i] = word[i];
            placed = true;
          }
        }
        attempts++;
      }
    });

    // Fill empty cells
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }
    setGrid(newGrid);
    setFoundWords([]);
    setFoundCells([]);
    setCurrentSelection([]);
  }, [config]);

  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  const handleCellClick = (r: number, c: number) => {
    if (isFinished) return;

    // Check if cell is already in current selection
    if (currentSelection.some(sel => sel.r === r && sel.c === c)) {
      setCurrentSelection([]);
      return;
    }

    // Enforce contiguous selection
    if (currentSelection.length > 0) {
      const last = currentSelection[currentSelection.length - 1];
      const dr = r - last.r;
      const dc = c - last.c;

      // Must be adjacent (8 directions)
      if (Math.abs(dr) > 1 || Math.abs(dc) > 1) {
        setCurrentSelection([{ r, c }]); // Start new selection from here
        return;
      }

      // If length > 1, must maintain same direction
      if (currentSelection.length > 1) {
        const first = currentSelection[0];
        const second = currentSelection[1];
        const expectedDr = second.r - first.r;
        const expectedDc = second.c - first.c;
        
        if (dr !== expectedDr || dc !== expectedDc) {
          setCurrentSelection([{ r, c }]); // Start new selection from here
          return;
        }
      }
    }

    const newSelection = [...currentSelection, { r, c }];
    setCurrentSelection(newSelection);
    playSound('click');

    const selectedWord = newSelection.map(sel => grid[sel.r][sel.c]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    const match = config.words.find(w => {
      const upperW = w.toUpperCase();
      return upperW === selectedWord || upperW === reversedWord;
    });

    if (match && !foundWords.includes(match.toUpperCase())) {
      const newFound = [...foundWords, match.toUpperCase()];
      setFoundWords(newFound);
      setFoundCells(prev => [...prev, ...newSelection]);
      setCurrentSelection([]);
      playSound('success');
      
      // Small confetti burst
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#20126E', '#19E196', '#FFC800']
      });

      if (newFound.length === config.words.length) {
        setIsFinished(true);
        playSound('gameComplete');
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#20126E', '#FFC800', '#19E196']
        });
        setTimeout(onComplete, 1500);
      }
    }
  };

  const clearSelection = () => {
    setCurrentSelection([]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-bold text-[#20126E]">
            Selectie: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{currentSelection.map(s => grid[s.r][s.c]).join('') || '...'}</span>
          </div>
          <button
            onClick={() => {
              clearSelection();
              playSound('click', 0.3);
            }}
            onMouseEnter={() => playSound('hover', 0.2)}
            className="text-xs font-bold text-gray-400 hover:text-[#20126E] flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Wis selectie
          </button>
        </div>
        <div 
          className="grid gap-px bg-gray-200 border border-gray-200 rounded-lg overflow-hidden"
          style={{ 
            gridTemplateColumns: `repeat(${config.gridSize}, minmax(0, 1fr))`,
            width: '100%',
            aspectRatio: '1/1'
          }}
        >
          {grid.map((row, r) => row.map((char, c) => {
            const isSelected = currentSelection.some(sel => sel.r === r && sel.c === c);
            const isFound = foundCells.some(sel => sel.r === r && sel.c === c);
            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`w-full h-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                  isSelected ? 'bg-[#FFC800] text-[#20126E]' : 
                  isFound ? 'bg-green-100 text-green-600' :
                  'bg-white hover:bg-gray-50'
                }`}
              >
                {char}
              </button>
            );
          }))}
        </div>
      </div>

      <div className="w-full lg:w-96">
        <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">Woordenlijst ({foundWords.length}/{config.words.length})</h4>
        <div className="grid grid-cols-2 gap-2">
          {config.words.map((word, i) => {
            const isFound = foundWords.includes(word.toUpperCase());
            return (
              <div 
                key={i} 
                className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all ${
                  isFound 
                    ? 'bg-green-100 text-green-600 line-through opacity-50' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {word}
                {isFound && <CheckCircle2 className="w-3 h-3" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
