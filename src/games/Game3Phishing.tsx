import { useState } from 'react';
import { ShieldAlert, ShieldCheck, Mail, User, AlertCircle } from 'lucide-react';
import { useShortcut } from '../hooks/useShortcut';
import { playSound } from '../services/soundService';

interface Game3PhishingProps {
  config: {
    emails: Array<{
      id: string;
      from: string;
      subject: string;
      body: string;
      isPhishing: boolean;
    }>;
    minCorrect: number;
  };
  onComplete: () => void;
}

export function Game3Phishing({ config, onComplete }: Game3PhishingProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  useShortcut('8', 5, onComplete);

  const handleAnswer = (isPhishing: boolean) => {
    const currentEmail = config.emails[currentIndex];
    const isCorrect = isPhishing === currentEmail.isPhishing;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      playSound('success');
    } else {
      playSound('fail');
    }

    if (currentIndex < config.emails.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const currentEmail = config.emails[currentIndex];

  if (showResult) {
    const passed = score >= config.minCorrect;
    return (
      <div className="text-center py-8">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {passed ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
        </div>
        <h3 className="text-2xl font-bold mb-2">{passed ? 'Goed gedaan!' : 'Helaas...'}</h3>
        <p className="text-gray-600 mb-8">Je hebt {score} van de {config.emails.length} emails correct beoordeeld.</p>
        
        {passed ? (
          <button 
            onClick={onComplete}
            className="bg-[#20126E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a0f5a] transition-all"
          >
            Ga Verder
          </button>
        ) : (
          <button 
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setShowResult(false);
            }}
            className="bg-[#20126E] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1a0f5a] transition-all"
          >
            Probeer Opnieuw
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500">
          <Mail className="w-5 h-5" />
          <span className="font-bold">Inbox ({currentIndex + 1}/{config.emails.length})</span>
        </div>
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Beoordeel deze email</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="bg-gray-50 p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">{currentEmail.from}</div>
              <div className="text-xs text-gray-500">Aan: u@summacollege.nl</div>
            </div>
          </div>
          <h4 className="text-lg font-bold text-[#20126E]">{currentEmail.subject}</h4>
        </div>
        <div className="p-8 min-h-[200px] text-gray-700 leading-relaxed whitespace-pre-wrap">
          {currentEmail.body}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => handleAnswer(false)}
          className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-green-100 bg-green-50 hover:bg-green-100 hover:border-green-200 transition-all group"
        >
          <ShieldCheck className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-green-700">Dit is een echte email</span>
        </button>
        <button
          onClick={() => handleAnswer(true)}
          className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 transition-all group"
        >
          <AlertCircle className="w-8 h-8 text-red-600 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-red-700">Dit is phishing</span>
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        Hint: Check de afzender en let op verdachte links of verzoeken.
      </p>
    </div>
  );
}
