/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Start } from './pages/Start';
import { EscapeRoom } from './pages/EscapeRoom';
import { AdminLogin } from './pages/AdminLogin';
import { AdminPanel } from './pages/AdminPanel';
import { getProgress, saveProgress, getAdminConfig } from './storage';
import { Progress, AdminConfig } from './types';

export default function App() {
  const [user, setUser] = useState<{ name: string; class: string } | null>(() => {
    const saved = sessionStorage.getItem('virusvrij_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [progress, setProgress] = useState<Progress>(() => getProgress());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminConfig, setAdminConfig] = useState<AdminConfig>(() => getAdminConfig());

  // Hidden admin trigger: 5x '9' within 5 seconds
  useEffect(() => {
    let keys: string[] = [];
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now();
      if (now - lastKeyTime > 5000) {
        keys = [];
      }
      lastKeyTime = now;

      if (e.key === '9') {
        keys.push('9');
        if (keys.length === 5) {
          setShowAdminLogin(true);
          keys = [];
        }
      } else {
        keys = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = (name: string, className: string) => {
    const newUser = { name, class: className };
    setUser(newUser);
    sessionStorage.setItem('virusvrij_user', JSON.stringify(newUser));
  };

  const handleReset = () => {
    if (confirm('Weet je zeker dat je opnieuw wilt beginnen? Je voortgang gaat verloren.')) {
      const resetProgress: Progress = {
        completedGames: {},
        skippedGames: {},
        attempts: {},
        startTime: Date.now()
      };
      setProgress(resetProgress);
      saveProgress(resetProgress);
    }
  };

  const handleGameComplete = (gameId: number) => {
    const newProgress = {
      ...progress,
      completedGames: { ...progress.completedGames, [gameId]: true }
    };
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  const handleGameSkip = (gameId: number) => {
    const newProgress = {
      ...progress,
      skippedGames: { ...progress.skippedGames, [gameId]: true }
    };
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  if (isAdminLoggedIn) {
    return (
      <AdminPanel 
        config={adminConfig} 
        onSave={(newConfig) => {
          setAdminConfig(newConfig);
          // Force refresh if needed or just rely on state
        }}
        onLogout={() => setIsAdminLoggedIn(false)} 
      />
    );
  }

  if (showAdminLogin) {
    return (
      <AdminLogin 
        onLogin={() => {
          setIsAdminLoggedIn(true);
          setShowAdminLogin(false);
        }} 
        onClose={() => setShowAdminLogin(false)} 
      />
    );
  }

  if (!user) {
    return <Start onStart={handleLogin} />;
  }

  return (
    <EscapeRoom
      user={user}
      progress={progress}
      config={adminConfig}
      onGameComplete={handleGameComplete}
      onGameSkip={handleGameSkip}
      onReset={handleReset}
      onLogout={() => {
        sessionStorage.removeItem('virusvrij_user');
        setUser(null);
      }}
    />
  );
}
