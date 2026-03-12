import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, RefreshCw, Trophy, Download, Circle as HelpCircle } from 'lucide-react';
import { Progress, AdminConfig } from '../types';
import { SuperComputer } from '../components/SuperComputer';
import { VirusMeter } from '../components/VirusMeter';
import { GameCard } from '../components/GameCard';
import { Modal } from '../components/Modal';
import { Game1Pattern } from '../games/Game1Pattern';
import { Game2Typing } from '../games/Game2Typing';
import { Game3Phishing } from '../games/Game3Phishing';
import { Game4Lookup } from '../games/Game4Lookup';
import { Game5WordSearch } from '../games/Game5WordSearch';
import { Game6PasswordStrength } from '../games/Game6PasswordStrength';
import { exportCertificate } from '../pdf/exportCertificate';
import { playSound } from '../services/soundService';
import confetti from 'canvas-confetti';

interface EscapeRoomProps {
  user: { name: string; class: string };
  progress: Progress;
  config: AdminConfig;
  onGameComplete: (gameId: number) => void;
  onGameSkip: (gameId: number) => void;
  onReset: () => void;
  onLogout: () => void;
}

export function EscapeRoom({ user, progress, config, onGameComplete, onGameSkip, onReset, onLogout }: EscapeRoomProps) {
  const [activeGame, setActiveGame] = useState<number | null>(null);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [rewardPiece, setRewardPiece] = useState<{ id: number; piece: string } | null>(null);
  const [finalPassword, setFinalPassword] = useState('');
  const [finalError, setFinalError] = useState(false);
  const [skipConfirmGame, setSkipConfirmGame] = useState<number | null>(null);

  const completedCount = Object.values(progress.completedGames).filter(Boolean).length;
  const skippedCount = Object.values(progress.skippedGames || {}).filter(Boolean).length;
  const allGamesDone = completedCount + skippedCount === 6;

  const puzzlePieces: Record<number, string> = {
    1: 'E',
    2: 'U',
    3: 'R',
    4: 'E',
    5: 'K',
    6: 'A'
  };

  const handleGameComplete = (gameId: number) => {
    onGameComplete(gameId);
    playSound('success');
    setRewardPiece({ id: gameId, piece: puzzlePieces[gameId] });
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#20126E', '#FFC800', '#19E196']
    });
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (finalPassword.toUpperCase() === 'EUREKA') {
      playSound('complete');
      setShowEndScreen(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#20126E', '#FFC800', '#19E196', '#DC1E50']
      });
    } else {
      playSound('fail');
      setFinalError(true);
      setTimeout(() => setFinalError(false), 2000);
    }
  };

  const games = [
    { id: 1, title: 'Informatie Zoeken', desc: 'Vind de antwoorden op de beveiligingsvragen.', icon: 'Search' },
    { id: 2, title: 'Patroon Herkennen', desc: 'Onthoud en herhaal het patroon op de supercomputer.', icon: 'Grid3x3' },
    { id: 3, title: 'Phishing Filter', desc: 'Herken de valse emails in de inbox.', icon: 'Mail' },
    { id: 4, title: 'Foutloos Typen', desc: 'Typ de beveiligingscode foutloos over.', icon: 'Keyboard' },
    { id: 5, title: 'Woordzoeker', desc: 'Zoek alle IT-termen in het raster.', icon: 'Grid3x3' },
    { id: 6, title: 'Wachtwoord Sterkte', desc: 'Maak een onkraakbaar wachtwoord.', icon: 'KeyRound' },
  ];

  const handleDownloadCertificate = () => {
    exportCertificate(user.name, user.class);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#20126E]">
      {/* Header */}
      <header className="bg-white border-b border-black/5 sticky top-0 z-40 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#20126E] p-2 rounded-lg">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-serif leading-tight">{config.appTitle}</h1>
              <p className="text-xs text-gray-500">{user.name} – {user.class}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Voortgang</span>
              <span className="text-lg font-bold">Kaartjes: {completedCount + skippedCount}/6</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onReset}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                title="Opnieuw beginnen"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                title="Uitloggen"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Games 1-3 */}
          <div className="lg:col-span-3 space-y-3 order-2 lg:order-1">
            {games.slice(0, 3).map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isCompleted={!!progress.completedGames[game.id]}
                isSkipped={!!progress.skippedGames?.[game.id]}
                codePiece={puzzlePieces[game.id]}
                onOpen={() => setActiveGame(game.id)}
                onSkipClick={() => setSkipConfirmGame(game.id)}
              />
            ))}
          </div>

          {/* Center Column: SuperComputer & Meter */}
          <div className="lg:col-span-6 space-y-8 order-1 lg:order-2">
            <SuperComputer isFinished={showEndScreen} completedCount={completedCount} />
            <VirusMeter
              completedCount={completedCount}
              codePieces={puzzlePieces}
              completedGames={progress.completedGames}
              skippedGames={progress.skippedGames || {}}
              gameIcons={games.map(g => g.icon)}
            />
            
            {allGamesDone && !showEndScreen && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[22px] shadow-xl border-2 border-[#20126E] text-center"
              >
                <h2 className="text-2xl font-bold mb-4">Voer het eindwachtwoord in</h2>
                <p className="text-gray-600 mb-6 text-sm">Je hebt alle puzzelstukjes verzameld. Wat is het geheime woord?</p>
                <form onSubmit={handleFinalSubmit} className="space-y-4">
                  <input 
                    type="text"
                    value={finalPassword}
                    onChange={(e) => {
                      setFinalPassword(e.target.value);
                      playSound('typing');
                    }}
                    placeholder="Wachtwoord"
                    className={`w-full px-6 py-4 rounded-xl border-2 text-center text-2xl font-bold tracking-widest outline-none transition-all ${
                      finalError ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-[#20126E]'
                    }`}
                  />
                  <button 
                    type="submit"
                    className="w-full bg-[#20126E] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1a0f5a] transition-all shadow-lg"
                  >
                    Kraak de Code
                  </button>
                </form>
              </motion.div>
            )}

            {showEndScreen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[22px] shadow-xl border-2 border-[#19E196] text-center"
              >
                <Trophy className="w-16 h-16 text-[#19E196] mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Missie Geslaagd!</h2>
                <p className="text-gray-600 mb-6">De supercomputer is volledig virusvrij. Goed gedaan!</p>
                <button 
                  onClick={handleDownloadCertificate}
                  className="bg-[#20126E] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-[#1a0f5a] transition-all shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download Certificaat
                </button>
              </motion.div>
            )}
          </div>

          {/* Right Column: Games 4-6 */}
          <div className="lg:col-span-3 space-y-3 order-3">
            {games.slice(3, 6).map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isCompleted={!!progress.completedGames[game.id]}
                isSkipped={!!progress.skippedGames?.[game.id]}
                codePiece={puzzlePieces[game.id]}
                onOpen={() => setActiveGame(game.id)}
                onSkipClick={() => setSkipConfirmGame(game.id)}
              />
            ))}
          </div>

        </div>
      </main>

      {/* Game Modals */}
      <AnimatePresence>
        {activeGame !== null && (
          <Modal 
            onClose={() => setActiveGame(null)} 
            title={games.find(g => g.id === activeGame)?.title || ''}
            noScroll={activeGame === 2}
          >
            {activeGame === 1 && <Game4Lookup config={config.game4} onComplete={() => { handleGameComplete(1); setActiveGame(null); }} />}
            {activeGame === 2 && <Game1Pattern config={config.game1} onComplete={() => { handleGameComplete(2); setActiveGame(null); }} />}
            {activeGame === 3 && <Game3Phishing config={config.game3} onComplete={() => { handleGameComplete(3); setActiveGame(null); }} />}
            {activeGame === 4 && <Game2Typing config={config.game2} onComplete={() => { handleGameComplete(4); setActiveGame(null); }} />}
            {activeGame === 5 && <Game5WordSearch config={config.game5} onComplete={() => { handleGameComplete(5); setActiveGame(null); }} />}
            {activeGame === 6 && <Game6PasswordStrength config={config.game6} onComplete={() => { handleGameComplete(6); setActiveGame(null); }} />}
          </Modal>
        )}
      </AnimatePresence>

      {/* Reward Modal */}
      <AnimatePresence>
        {rewardPiece && (
          <Modal onClose={() => setRewardPiece(null)} title="Goed gedaan!">
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Je hebt een puzzelstukje verdiend!</h3>
              <p className="text-gray-600 mb-8">
                Voor het voltooien van dit spel krijg je de letter:
              </p>
              <div className="text-6xl font-bold text-[#20126E] bg-gray-50 w-24 h-24 flex items-center justify-center mx-auto rounded-2xl border-2 border-dashed border-[#20126E]">
                {rewardPiece.piece}
              </div>
              <button
                onClick={() => setRewardPiece(null)}
                className="mt-10 bg-[#20126E] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#1a0f5a] transition-all"
              >
                Verder naar de volgende opdracht
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Skip Confirmation Modal */}
      <AnimatePresence>
        {skipConfirmGame && (
          <Modal onClose={() => setSkipConfirmGame(null)} title="Spel overslaan?">
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-[#FFC800]/20 text-[#FFC800] rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Heb jij dit spel al eerder gespeeld?</h3>
              <p className="text-gray-600 mb-8">
                Als je dit spel al in een vorige les hebt voltooid en de code hebt opgeschreven, kun je dit spel overslaan.
                Je krijgt dan een vraagteken in de virusmeter en kunt de eindcode invullen als je alle puzzels hebt afgerond.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    playSound('click');
                    setSkipConfirmGame(null);
                  }}
                  className="px-8 py-4 rounded-xl font-bold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                >
                  Nee, ik wil spelen
                </button>
                <button
                  onClick={() => {
                    if (skipConfirmGame) {
                      playSound('success');
                      onGameSkip(skipConfirmGame);
                      setSkipConfirmGame(null);
                    }
                  }}
                  className="px-8 py-4 rounded-xl font-bold bg-[#FFC800] text-[#20126E] hover:bg-[#e6b400] transition-all"
                >
                  Ja, overslaan
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function Cpu(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  );
}
