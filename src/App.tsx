import React, { useState, useEffect } from 'react';
import { Users, Gift, History, Settings, LayoutGrid } from 'lucide-react';
import NameManagement from './components/NameManagement';
import LuckyDraw from './components/LuckyDraw';
import DrawHistory from './components/DrawHistory';
import GroupGenerator from './components/GroupGenerator';

export type DrawRecord = {
  id: string;
  prizeName: string;
  winners: string[];
  timestamp: number;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'names' | 'draw' | 'groups' | 'history'>('names');
  const [allNames, setAllNames] = useState<string[]>([]);
  const [drawHistory, setDrawHistory] = useState<DrawRecord[]>([]);
  const [allowRepeat, setAllowRepeat] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedNames = localStorage.getItem('luckyDraw_names');
    const savedHistory = localStorage.getItem('luckyDraw_history');
    const savedAllowRepeat = localStorage.getItem('luckyDraw_allowRepeat');

    if (savedNames) setAllNames(JSON.parse(savedNames));
    if (savedHistory) setDrawHistory(JSON.parse(savedHistory));
    if (savedAllowRepeat) setAllowRepeat(JSON.parse(savedAllowRepeat));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('luckyDraw_names', JSON.stringify(allNames));
    localStorage.setItem('luckyDraw_history', JSON.stringify(drawHistory));
    localStorage.setItem('luckyDraw_allowRepeat', JSON.stringify(allowRepeat));
  }, [allNames, drawHistory, allowRepeat]);

  const handleClearHistory = () => {
    if (window.confirm('確定要清除所有抽籤紀錄嗎？')) {
      setDrawHistory([]);
    }
  };

  const handleClearNames = () => {
    if (window.confirm('確定要清空所有名單嗎？這將會同時清除抽籤紀錄。')) {
      setAllNames([]);
      setDrawHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <Gift className="w-6 h-6" />
            HR 抽籤小幫手
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('names')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'names'
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-5 h-5" />
            名單管理
          </button>
          <button
            onClick={() => setActiveTab('draw')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'draw'
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Gift className="w-5 h-5" />
            獎品抽籤
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'groups'
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            自動分組
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              activeTab === 'history'
                ? 'bg-indigo-50 text-indigo-700 font-medium'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <History className="w-5 h-5" />
            抽籤紀錄
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
          HR Lucky Draw Tool
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'names' && (
            <NameManagement
              allNames={allNames}
              setAllNames={setAllNames}
              onClearNames={handleClearNames}
            />
          )}
          {activeTab === 'draw' && (
            <LuckyDraw
              allNames={allNames}
              drawHistory={drawHistory}
              setDrawHistory={setDrawHistory}
              allowRepeat={allowRepeat}
              setAllowRepeat={setAllowRepeat}
            />
          )}
          {activeTab === 'history' && (
            <DrawHistory
              drawHistory={drawHistory}
              onClearHistory={handleClearHistory}
            />
          )}
          {activeTab === 'groups' && (
            <GroupGenerator allNames={allNames} />
          )}
        </div>
      </main>
    </div>
  );
}
