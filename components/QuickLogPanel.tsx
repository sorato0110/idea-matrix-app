import React, { useMemo, useState } from 'https://esm.sh/react@18?dev&jsx=automatic';
import type { Hypothesis, QuickLog } from '../types.ts';

export const QuickLogPanel = ({
  open,
  hypothesis,
  onClose,
  onSave,
}: {
  open: boolean;
  hypothesis?: Hypothesis;
  onClose: () => void;
  onSave: (log: QuickLog) => void;
}) => {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [kpi, setKpi] = useState(0);
  const [note, setNote] = useState('');

  const sortedLogs = useMemo(() => {
    if (!hypothesis) return [];
    return [...hypothesis.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [hypothesis]);

  const handleSave = () => {
    if (!hypothesis) return;
    const log: QuickLog = {
      id: crypto.randomUUID(),
      date,
      kpi: Number(kpi),
      note,
    };
    onSave(log);
    setNote('');
  };

  return (
    <div
      className={`fixed inset-0 z-40 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-200 p-5 flex flex-col gap-4 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        } animate-slideUp`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-900">クイックログ</div>
            <p className="text-sm text-slate-500">日々の進捗をチャットのように残せます。</p>
          </div>
          <button className="text-slate-400 hover:text-slate-600" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
          <div className="font-semibold text-slate-800">対象</div>
          <div className="text-base font-bold text-indigo-700">{hypothesis?.title ?? '---'}</div>
          <div className="text-xs text-slate-500">ステータス: {hypothesis?.status}</div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-800 block">
            日付
            <input
              type="date"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label className="text-sm font-semibold text-slate-800 block">
            KPI / 指標
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              value={kpi}
              onChange={(e) => setKpi(Number(e.target.value))}
              placeholder="例: コンバージョン数"
            />
          </label>
          <label className="text-sm font-semibold text-slate-800 block">
            メモ
            <textarea
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 min-h-[80px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="定性的なメモを残す"
            />
          </label>
          <button
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700"
            onClick={handleSave}
          >
            ログを追加
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 border-t border-slate-100 pt-3">
          {sortedLogs.length === 0 && <div className="text-sm text-slate-500">まだログがありません。</div>}
          {sortedLogs.map((log) => (
            <div key={log.id} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{log.date}</span>
                <span className="font-semibold text-indigo-700">KPI: {log.kpi}</span>
              </div>
              <p className="text-sm text-slate-800 whitespace-pre-wrap">{log.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
