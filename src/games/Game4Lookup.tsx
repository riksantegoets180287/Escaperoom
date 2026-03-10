import { useState } from 'react';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import { useShortcut } from '../hooks/useShortcut';
import { playSound } from '../services/soundService';

interface Game4LookupProps {
  config: {
    questions: Array<{
      id: string;
      prompt: string;
      acceptableAnswers: string[];
    }>;
  };
  onComplete: () => void;
}

export function Game4Lookup({ config, onComplete }: Game4LookupProps) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<{ [key: string]: boolean | null }>({});
  const [isFinished, setIsFinished] = useState(false);

  useShortcut('8', 5, onComplete);

  const normalize = (str: string) => {
    return str.toLowerCase().trim().replace(/[.,!?;:]/g, '');
  };

  const handleCheck = () => {
    const newResults: { [key: string]: boolean } = {};
    let allCorrect = true;

    config.questions.forEach(q => {
      const userAns = normalize(answers[q.id] || '');
      const isCorrect = q.acceptableAnswers.some(acc => normalize(acc) === userAns);
      newResults[q.id] = isCorrect;
      if (!isCorrect) allCorrect = true; // Wait, if not correct, allCorrect should be false
    });

    // Correcting logic
    config.questions.forEach(q => {
      const userAns = normalize(answers[q.id] || '');
      const isCorrect = q.acceptableAnswers.some(acc => normalize(acc) === userAns);
      newResults[q.id] = isCorrect;
    });
    
    const finalAllCorrect = config.questions.every(q => newResults[q.id]);
    setResults(newResults);

    if (finalAllCorrect) {
      setIsFinished(true);
      playSound('success');
      setTimeout(onComplete, 1500);
    } else {
      playSound('fail');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
        <Search className="w-5 h-5 text-blue-500 mt-0.5" />
        <p className="text-sm text-blue-700">
          Gebruik een zoekmachine om de antwoorden op deze vragen te vinden. Typ het antwoord in het veld.
        </p>
      </div>

      <div className="space-y-6">
        {config.questions.map((q, index) => (
          <div key={q.id} className="relative">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {index + 1}. {q.prompt}
            </label>
            <div className="relative">
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => {
                  setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                  setResults(prev => ({ ...prev, [q.id]: null }));
                  playSound('typing', 0.2);
                }}
                onFocus={() => playSound('click', 0.3)}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  results[q.id] === true ? 'border-green-500 bg-green-50' :
                  results[q.id] === false ? 'border-red-500 bg-red-50' :
                  'border-gray-200 focus:ring-2 focus:ring-[#20126E]'
                }`}
                placeholder="Jouw antwoord..."
                disabled={isFinished}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                {results[q.id] === true && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {results[q.id] === false && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleCheck}
        onMouseEnter={() => playSound('hover', 0.2)}
        disabled={isFinished}
        className={`w-full mt-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
          isFinished
            ? 'bg-green-500 text-white'
            : 'bg-[#20126E] text-white hover:bg-[#1a0f5a]'
        }`}
      >
        {isFinished ? 'Alles Correct!' : 'Controleer Antwoorden'}
      </button>
    </div>
  );
}
