import { useState } from 'react';
import { motion } from 'motion/react';
import { Save, LogOut, Settings, Grid3x3, Keyboard, Mail, Search, KeyRound, RefreshCw } from 'lucide-react';
import { AdminConfig, DEFAULT_ADMIN_CONFIG } from '../types';
import { saveAdminConfig } from '../storage';

interface AdminPanelProps {
  config: AdminConfig;
  onSave: (config: AdminConfig) => void;
  onLogout: () => void;
}

export function AdminPanel({ config, onSave, onLogout }: AdminPanelProps) {
  const [localConfig, setLocalConfig] = useState<AdminConfig>(config);
  const [activeTab, setActiveTab] = useState('algemeen');

  const handleSave = () => {
    saveAdminConfig(localConfig);
    onSave(localConfig);
    alert('Instellingen opgeslagen!');
  };

  const handleReset = () => {
    if (confirm('Weet je zeker dat je alle instellingen wilt herstellen naar de standaardwaarden?')) {
      setLocalConfig(DEFAULT_ADMIN_CONFIG);
    }
  };

  const tabs = [
    { id: 'algemeen', label: 'Algemeen', icon: Settings },
    { id: 'spel2', label: 'Spel 1 (Typen)', icon: Keyboard },
    { id: 'spel1', label: 'Spel 2 (Patroon)', icon: Grid3x3 },
    { id: 'spel3', label: 'Spel 3', icon: Mail },
    { id: 'spel4', label: 'Spel 4', icon: Search },
    { id: 'spel5', label: 'Spel 5', icon: Grid3x3 },
    { id: 'spel6', label: 'Spel 6', icon: KeyRound },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F4] flex flex-col">
      {/* Admin Header */}
      <header className="bg-[#20126E] text-white px-8 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Settings className="w-6 h-6" />
          <h1 className="text-xl font-bold font-serif tracking-tight">Beheerpaneel – Operation Virusvrij</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm font-bold">
            <RefreshCw className="w-4 h-4" /> Reset Standaard
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#19E196] text-[#20126E] hover:bg-[#15c080] rounded-lg transition-all text-sm font-bold">
            <Save className="w-4 h-4" /> Opslaan
          </button>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-all text-sm font-bold">
            <LogOut className="w-4 h-4" /> Afsluiten
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id ? 'bg-[#20126E] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            
            {activeTab === 'algemeen' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-serif mb-6">Algemene Instellingen</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">App Titel</label>
                  <input 
                    type="text" 
                    value={localConfig.appTitle}
                    onChange={e => setLocalConfig({...localConfig, appTitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20126E] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(id => (
                    <div key={id}>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Code Kaartje Spel {id}</label>
                      <input 
                        type="text" 
                        value={localConfig.codePieces[id]}
                        onChange={e => setLocalConfig({
                          ...localConfig, 
                          codePieces: { ...localConfig.codePieces, [id]: e.target.value }
                        })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20126E] outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'spel1' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-serif mb-6">Spel 1: Patroon</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Raster Grootte (bijv. 7 voor 7x7)</label>
                    <input 
                      type="number" 
                      value={localConfig.game1.gridSize}
                      onChange={e => setLocalConfig({...localConfig, game1: { ...localConfig.game1, gridSize: parseInt(e.target.value) }})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20126E] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Patroon Lengte</label>
                    <input 
                      type="number" 
                      value={localConfig.game1.patternLength}
                      onChange={e => setLocalConfig({...localConfig, game1: { ...localConfig.game1, patternLength: parseInt(e.target.value) }})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20126E] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'spel2' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-serif mb-6">Spel 2: Typen</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Doeltekst</label>
                  <textarea 
                    value={localConfig.game2.targetText}
                    onChange={e => setLocalConfig({...localConfig, game2: { ...localConfig.game2, targetText: e.target.value }})}
                    className="w-full h-48 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20126E] outline-none font-mono text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Minimaal Percentage Goed</label>
                    <input 
                      type="number" 
                      value={localConfig.game2.passPercent}
                      onChange={e => setLocalConfig({...localConfig, game2: { ...localConfig.game2, passPercent: parseInt(e.target.value) }})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20126E] outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'spel3' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-serif mb-6">Spel 3: Phishing</h2>
                <div className="space-y-4">
                  {localConfig.game3.emails.map((email, idx) => (
                    <div key={email.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <input 
                          type="text" 
                          value={email.from}
                          onChange={e => {
                            const newEmails = [...localConfig.game3.emails];
                            newEmails[idx].from = e.target.value;
                            setLocalConfig({...localConfig, game3: { ...localConfig.game3, emails: newEmails }});
                          }}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                          placeholder="Van"
                        />
                        <input 
                          type="text" 
                          value={email.subject}
                          onChange={e => {
                            const newEmails = [...localConfig.game3.emails];
                            newEmails[idx].subject = e.target.value;
                            setLocalConfig({...localConfig, game3: { ...localConfig.game3, emails: newEmails }});
                          }}
                          className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                          placeholder="Onderwerp"
                        />
                      </div>
                      <textarea 
                        value={email.body}
                        onChange={e => {
                          const newEmails = [...localConfig.game3.emails];
                          newEmails[idx].body = e.target.value;
                          setLocalConfig({...localConfig, game3: { ...localConfig.game3, emails: newEmails }});
                        }}
                        className="w-full h-24 px-3 py-2 rounded-lg border border-gray-200 text-sm mb-2"
                        placeholder="Inhoud"
                      />
                      <label className="flex items-center gap-2 text-sm font-bold">
                        <input 
                          type="checkbox" 
                          checked={email.isPhishing}
                          onChange={e => {
                            const newEmails = [...localConfig.game3.emails];
                            newEmails[idx].isPhishing = e.target.checked;
                            setLocalConfig({...localConfig, game3: { ...localConfig.game3, emails: newEmails }});
                          }}
                        />
                        Is Phishing?
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'spel4' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-serif mb-6">Spel 4: Opzoeken</h2>
                <div className="space-y-6">
                  {localConfig.game4.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50">
                      <input 
                        type="text" 
                        value={q.prompt}
                        onChange={e => {
                          const newQs = [...localConfig.game4.questions];
                          newQs[idx].prompt = e.target.value;
                          setLocalConfig({...localConfig, game4: { ...localConfig.game4, questions: newQs }});
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm mb-3 font-bold"
                        placeholder="Vraag"
                      />
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Geaccepteerde Antwoorden (gescheiden door komma)</label>
                        <input 
                          type="text" 
                          value={q.acceptableAnswers.join(', ')}
                          onChange={e => {
                            const newQs = [...localConfig.game4.questions];
                            newQs[idx].acceptableAnswers = e.target.value.split(',').map(s => s.trim());
                            setLocalConfig({...localConfig, game4: { ...localConfig.game4, questions: newQs }});
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'spel5' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-serif mb-6">Spel 5: Woordzoeker</h2>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Woordenlijst (één per regel)</label>
                  <textarea 
                    value={localConfig.game5.words.join('\n')}
                    onChange={e => setLocalConfig({...localConfig, game5: { ...localConfig.game5, words: e.target.value.split('\n').filter(s => s.trim() !== '') }})}
                    className="w-full h-64 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#20126E] outline-none font-mono text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === 'spel6' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold font-serif mb-6">Spel 6: Wachtwoord</h2>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl">
                  <h4 className="font-bold text-blue-800 mb-2">Wachtwoord Regels (Vast)</h4>
                  <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                    <li>Minimaal 12 tekens</li>
                    <li>Minimaal 4 hoofdletters</li>
                    <li>Minimaal 2 cijfers</li>
                    <li>Minimaal 3 vreemde tekens (!@#$%^&*())</li>
                  </ul>
                </div>
                <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                  <input 
                    type="checkbox" 
                    checked={localConfig.game6.showExample}
                    onChange={e => setLocalConfig({...localConfig, game6: { ...localConfig.game6, showExample: e.target.checked }})}
                    className="w-5 h-5"
                  />
                  <span className="font-bold text-gray-700">Toon voorbeeld wachtwoord aan leerling</span>
                </label>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
