import React, { useState, useEffect, useMemo } from 'react';
import { Gift, Trophy, Settings2, Users, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DrawRecord } from '../App';
import { motion, AnimatePresence } from 'motion/react';

interface LuckyDrawProps {
  allNames: string[];
  drawHistory: DrawRecord[];
  setDrawHistory: React.Dispatch<React.SetStateAction<DrawRecord[]>>;
  allowRepeat: boolean;
  setAllowRepeat: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LuckyDraw({
  allNames,
  drawHistory,
  setDrawHistory,
  allowRepeat,
  setAllowRepeat,
}: LuckyDrawProps) {
  const [prizeName, setPrizeName] = useState('');
  const [winnerCount, setWinnerCount] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDisplayNames, setCurrentDisplayNames] = useState<string[]>([]);
  const [finalWinners, setFinalWinners] = useState<string[]>([]);

  // Calculate available pool
  const availablePool = useMemo(() => {
    if (allowRepeat) return allNames;
    
    const pastWinners = new Set(drawHistory.flatMap(record => record.winners));
    return allNames.filter(name => !pastWinners.has(name));
  }, [allNames, drawHistory, allowRepeat]);

  const handleDraw = () => {
    if (availablePool.length === 0) {
      alert('沒有可抽籤的名單！請先新增名單或允許重複中獎。');
      return;
    }
    
    if (winnerCount > availablePool.length) {
      alert(`要抽出的數量 (${winnerCount}) 大於可抽籤人數 (${availablePool.length})！`);
      return;
    }

    setIsDrawing(true);
    setFinalWinners([]);
    
    // Animation logic
    let duration = 3000; // 3 seconds
    let interval = 50; // 50ms per frame
    let elapsed = 0;

    const animationTimer = setInterval(() => {
      elapsed += interval;
      
      // Pick random names for display
      const randomDisplay = [];
      const poolCopy = [...availablePool];
      for (let i = 0; i < winnerCount; i++) {
        if (poolCopy.length > 0) {
          const randomIndex = Math.floor(Math.random() * poolCopy.length);
          randomDisplay.push(poolCopy[randomIndex]);
          poolCopy.splice(randomIndex, 1);
        }
      }
      setCurrentDisplayNames(randomDisplay);

      if (elapsed >= duration) {
        clearInterval(animationTimer);
        
        // Final draw
        const finalSelected = [];
        const finalPoolCopy = [...availablePool];
        for (let i = 0; i < winnerCount; i++) {
          if (finalPoolCopy.length > 0) {
            const randomIndex = Math.floor(Math.random() * finalPoolCopy.length);
            finalSelected.push(finalPoolCopy[randomIndex]);
            finalPoolCopy.splice(randomIndex, 1);
          }
        }
        
        setFinalWinners(finalSelected);
        setCurrentDisplayNames(finalSelected);
        setIsDrawing(false);
        
        // Save to history
        const newRecord: DrawRecord = {
          id: Date.now().toString(),
          prizeName: prizeName || `獎項 ${drawHistory.length + 1}`,
          winners: finalSelected,
          timestamp: Date.now(),
        };
        setDrawHistory(prev => [newRecord, ...prev]);
        
        // Trigger confetti
        triggerConfetti();
      }
    }, interval);
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">獎品抽籤</h2>
          <p className="text-slate-500 mt-1">設定獎項並開始隨機抽籤</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-800 pb-4 border-b border-slate-100">
            <Settings2 className="w-5 h-5 text-indigo-500" />
            抽籤設定
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">
                獎品名稱 (選填)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Gift className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={prizeName}
                  onChange={(e) => setPrizeName(e.target.value)}
                  placeholder="例如：頭獎 iPhone 15"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  disabled={isDrawing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 block">
                抽出人數
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, availablePool.length)}
                  value={winnerCount}
                  onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  disabled={isDrawing}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={allowRepeat}
                    onChange={(e) => setAllowRepeat(e.target.checked)}
                    disabled={isDrawing}
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${allowRepeat ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${allowRepeat ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                  允許重複中獎
                </span>
              </label>
              <p className="text-xs text-slate-500 mt-2 ml-14">
                {allowRepeat ? '已中獎的人仍可參與下次抽籤' : '已中獎的人將從候選名單中移除'}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-800">目前可抽籤人數</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{availablePool.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Draw Area */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-100 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-100 rounded-full blur-3xl"></div>
          </div>

          <div className="z-10 w-full max-w-lg flex flex-col items-center">
            <div className="mb-8 text-center">
              <h3 className="text-xl font-medium text-slate-500 mb-2">
                {prizeName || '準備抽出幸運兒'}
              </h3>
              <div className="text-sm text-slate-400">
                將抽出 {winnerCount} 名
              </div>
            </div>

            {/* Display Area */}
            <div className="w-full min-h-[200px] bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 flex items-center justify-center mb-10 shadow-inner relative">
              {currentDisplayNames.length === 0 && !isDrawing && finalWinners.length === 0 ? (
                <div className="text-slate-400 flex flex-col items-center gap-3">
                  <Trophy className="w-16 h-16 opacity-20" />
                  <p className="font-medium">點擊下方按鈕開始抽籤</p>
                </div>
              ) : (
                <div className="w-full flex flex-wrap justify-center gap-4">
                  <AnimatePresence mode="popLayout">
                    {currentDisplayNames.map((name, index) => (
                      <motion.div
                        key={`${name}-${index}-${isDrawing ? 'drawing' : 'final'}`}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 20,
                          duration: isDrawing ? 0.1 : 0.5
                        }}
                        className={`
                          px-6 py-4 rounded-2xl font-bold text-center shadow-sm border
                          ${isDrawing 
                            ? 'bg-white text-slate-700 border-slate-200 text-2xl' 
                            : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-transparent text-3xl shadow-lg shadow-indigo-200'
                          }
                        `}
                      >
                        {name}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <button
              onClick={handleDraw}
              disabled={isDrawing || availablePool.length === 0}
              className={`
                relative group overflow-hidden rounded-full px-12 py-5 font-bold text-xl transition-all
                ${isDrawing || availablePool.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-1'
                }
              `}
            >
              {isDrawing ? (
                <span className="flex items-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                  抽籤中...
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Trophy className="w-6 h-6" />
                  開始抽籤
                </span>
              )}
              
              {/* Button shine effect */}
              {!isDrawing && availablePool.length > 0 && (
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
