import React, { useState } from 'react';
import { Users, Download, Shuffle, LayoutGrid } from 'lucide-react';

interface GroupGeneratorProps {
  allNames: string[];
}

export default function GroupGenerator({ allNames }: GroupGeneratorProps) {
  const [groupSize, setGroupSize] = useState<number>(3);
  const [groups, setGroups] = useState<string[][]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateGroups = () => {
    if (allNames.length === 0) {
      alert('請先至「名單管理」新增人員名單！');
      return;
    }
    if (groupSize < 1) {
      alert('每組人數必須大於 0');
      return;
    }

    setIsGenerating(true);
    
    // Add a small delay for visual feedback
    setTimeout(() => {
      const shuffled = [...allNames].sort(() => Math.random() - 0.5);
      const newGroups: string[][] = [];
      
      for (let i = 0; i < shuffled.length; i += groupSize) {
        newGroups.push(shuffled.slice(i, i + groupSize));
      }
      
      setGroups(newGroups);
      setIsGenerating(false);
    }, 300);
  };

  const handleDownloadCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // BOM for Excel UTF-8 compatibility
    csvContent += "組別,姓名\n";
    
    groups.forEach((group, index) => {
      group.forEach(name => {
        // Escape quotes if necessary
        const safeName = name.includes(',') ? `"${name}"` : name;
        csvContent += `第 ${index + 1} 組,${safeName}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `自動分組結果_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">自動分組</h2>
          <p className="text-slate-500 mt-1">設定每組人數，系統將隨機為您分組</p>
        </div>
        {groups.length > 0 && (
          <button
            onClick={handleDownloadCSV}
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 border border-emerald-100"
          >
            <Download className="w-5 h-5" />
            下載 CSV
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="w-full sm:w-64 space-y-2">
            <label className="text-sm font-medium text-slate-700 block">
              每組人數
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                min="1"
                max={Math.max(1, allNames.length)}
                value={groupSize}
                onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <button
            onClick={handleGenerateGroups}
            disabled={isGenerating || allNames.length === 0}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium px-8 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 h-[46px]"
          >
            <Shuffle className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? '分組中...' : '開始隨機分組'}
          </button>
        </div>
        
        <div className="mt-4 text-sm text-slate-500 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          目前總人數：{allNames.length} 人
          {allNames.length > 0 && groupSize > 0 && (
            <span>
              (預計分為 {Math.ceil(allNames.length / groupSize)} 組)
            </span>
          )}
        </div>
      </div>

      {/* Results Area */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group, index) => (
            <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-100 flex items-center justify-between">
                <h3 className="font-bold text-indigo-900">第 {index + 1} 組</h3>
                <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                  {group.length} 人
                </span>
              </div>
              <div className="p-2">
                <ul className="divide-y divide-slate-50">
                  {group.map((member, mIndex) => (
                    <li key={mIndex} className="px-3 py-2 text-slate-700 text-sm flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                      {member}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-slate-400">
          <LayoutGrid className="w-12 h-12 opacity-20 mb-4" />
          <p className="text-lg font-medium">尚未產生分組</p>
          <p className="text-sm mt-1">設定每組人數並點擊「開始隨機分組」</p>
        </div>
      )}
    </div>
  );
}
