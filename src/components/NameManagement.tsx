import React, { useState, useRef, useMemo } from 'react';
import { Upload, FileText, Trash2, Plus, Users, AlertTriangle, Wand2 } from 'lucide-react';
import Papa from 'papaparse';

interface NameManagementProps {
  allNames: string[];
  setAllNames: React.Dispatch<React.SetStateAction<string[]>>;
  onClearNames: () => void;
}

export default function NameManagement({ allNames, setAllNames, onClearNames }: NameManagementProps) {
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Count occurrences to find duplicates
  const nameCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allNames.forEach(name => {
      counts[name] = (counts[name] || 0) + 1;
    });
    return counts;
  }, [allNames]);

  const hasDuplicates = Object.values(nameCounts).some((count: any) => count > 1);

  const handleAddNames = () => {
    if (!inputText.trim()) return;
    
    const newNames = inputText
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
      
    if (newNames.length > 0) {
      setAllNames(prev => [...prev, ...newNames]);
      setInputText('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results) => {
        const parsedNames: string[] = [];
        results.data.forEach((row: any) => {
          if (Array.isArray(row) && row.length > 0) {
            // Take the first column
            const cell = row[0];
            if (typeof cell === 'string' && cell.trim()) {
              parsedNames.push(cell.trim());
            }
          } else if (typeof row === 'string' && row.trim()) {
            parsedNames.push(row.trim());
          }
        });

        if (parsedNames.length > 0) {
          setAllNames(prev => [...prev, ...parsedNames]);
        }
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        alert('解析 CSV 檔案時發生錯誤');
      }
    });
  };

  const handleRemoveName = (indexToRemove: number) => {
    setAllNames(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveDuplicates = () => {
    setAllNames(Array.from(new Set(allNames)));
  };

  const handleLoadMockData = () => {
    const mockData = [
      '王小明', '李大華', '張三', '李四', '王五', 
      '趙六', '孫七', '周八', '吳九', '鄭十',
      '陳一', '林二', '黃三', '張三', '李四' // Intentionally added duplicates for demonstration
    ];
    setAllNames(prev => [...prev, ...mockData]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">名單管理</h2>
          <p className="text-slate-500 mt-1">上傳或貼上參與抽籤的人員名單</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLoadMockData}
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            載入模擬名單
          </button>
          <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Users className="w-5 h-5" />
            總人數：{allNames.length} 人
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            手動輸入或貼上
          </h3>
          <p className="text-sm text-slate-500">請輸入姓名，每行一個名字或以逗號分隔。</p>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="例如：&#10;王小明&#10;李大華&#10;張三"
            className="w-full h-40 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          />
          
          <button
            onClick={handleAddNames}
            disabled={!inputText.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            加入名單
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-slate-400">或</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-500" />
              上傳 CSV 檔案
            </h3>
            <p className="text-sm text-slate-500">支援 .csv 格式，系統會自動讀取第一欄。</p>
            
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 text-slate-600 font-medium py-4 rounded-xl cursor-pointer transition-colors"
            >
              <Upload className="w-5 h-5" />
              選擇 CSV 檔案
            </label>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-slate-800">目前名單 ({allNames.length})</h3>
              {hasDuplicates && (
                <button
                  onClick={handleRemoveDuplicates}
                  className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 border border-amber-200"
                >
                  <AlertTriangle className="w-4 h-4" />
                  一鍵移除重複
                </button>
              )}
            </div>
            {allNames.length > 0 && (
              <button
                onClick={onClearNames}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                清空名單
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto border border-slate-100 rounded-xl bg-slate-50 p-2">
            {allNames.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Users className="w-12 h-12 opacity-20" />
                <p>目前沒有任何名單</p>
                <p className="text-sm">請從左側輸入或上傳</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allNames.map((name, index) => {
                  const isDuplicate = nameCounts[name] > 1;
                  return (
                    <div
                      key={`${name}-${index}`}
                      className={`
                        bg-white border rounded-lg px-3 py-2 flex items-center justify-between group transition-colors
                        ${isDuplicate ? 'border-amber-300 bg-amber-50/50' : 'border-slate-200 hover:border-indigo-300'}
                      `}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="truncate text-slate-700 text-sm font-medium" title={name}>
                          {name}
                        </span>
                        {isDuplicate && (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" title="重複的姓名" />
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveName(index)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
