import React from 'react';
import { History, Trash2, Gift, Clock, Users } from 'lucide-react';
import { DrawRecord } from '../App';

interface DrawHistoryProps {
  drawHistory: DrawRecord[];
  onClearHistory: () => void;
}

export default function DrawHistory({ drawHistory, onClearHistory }: DrawHistoryProps) {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date(timestamp));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">抽籤紀錄</h2>
          <p className="text-slate-500 mt-1">查看過去的抽籤結果</p>
        </div>
        {drawHistory.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 border border-red-100"
          >
            <Trash2 className="w-5 h-5" />
            清除紀錄
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {drawHistory.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400 space-y-4">
            <div className="bg-slate-50 p-4 rounded-full">
              <History className="w-12 h-12 opacity-50" />
            </div>
            <p className="text-lg font-medium">尚無抽籤紀錄</p>
            <p className="text-sm">進行第一次抽籤後，紀錄將顯示於此</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {drawHistory.map((record, index) => (
              <div key={record.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                      <Gift className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {record.prizeName}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {record.winners.length} 名得主
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(record.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full w-fit">
                    #{drawHistory.length - index}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <div className="flex flex-wrap gap-2">
                    {record.winners.map((winner, idx) => (
                      <span
                        key={`${winner}-${idx}`}
                        className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </span>
                        {winner}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
