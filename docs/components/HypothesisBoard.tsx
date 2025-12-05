import React, { useMemo, useState } from 'https://esm.sh/react@18?dev&jsx=automatic';
import { STATUSES } from '../constants.ts';
import type { Hypothesis, HypothesisStatus, Idea, QuickLog } from '../types.ts';
import { QuickLogPanel } from './QuickLogPanel.tsx';

const StatusSelect = ({ value, onChange }: { value: HypothesisStatus; onChange: (v: HypothesisStatus) => void }) => (
  <select
    className="rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white"
    value={value}
    onChange={(e) => onChange(e.target.value as HypothesisStatus)}
  >
    {STATUSES.map((s) => (
      <option key={s.key} value={s.key}>
        {s.label}
      </option>
    ))}
  </select>
);

export const HypothesisBoard = ({
  ideas,
  hypotheses,
  setHypotheses,
}: {
  ideas: Idea[];
  hypotheses: Hypothesis[];
  setHypotheses: (items: Hypothesis[]) => void;
}) => {
  const [title, setTitle] = useState('');
  const [memo, setMemo] = useState('');
  const [ideaId, setIdeaId] = useState<string>('');
  const [openLogId, setOpenLogId] = useState<string | null>(null);

  const totalResource = useMemo(
    () => hypotheses.reduce((sum, h) => sum + (Number.isFinite(h.resource) ? h.resource : 0), 0),
    [hypotheses]
  );

  const addHypothesis = () => {
    if (!title.trim()) return;
    const item: Hypothesis = {
      id: crypto.randomUUID(),
      title: title.trim(),
      status: 'Trial',
      memo,
      ideaId: ideaId || undefined,
      resource: 10,
      logs: [],
    };
    setHypotheses([...hypotheses, item]);
    setTitle('');
    setMemo('');
    setIdeaId('');
  };

  const updateHypothesis = (id: string, patch: Partial<Hypothesis>) => {
    setHypotheses(hypotheses.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  };

  const selectedHypothesis = hypotheses.find((h) => h.id === openLogId);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-900">仮説を追加</div>
            <p className="text-sm text-slate-600">Trial から始めて MAB のように注力対象を絞ります。</p>
          </div>
          <div className={`text-sm font-semibold ${totalResource > 100 ? 'text-rose-600' : 'text-slate-500'}`}>
            リソース配分: {totalResource}%
          </div>
        </div>
        <div className={`h-2 rounded-full bg-slate-100 overflow-hidden ${totalResource > 100 ? 'ring-2 ring-rose-200' : ''}`}>
          <div
            className={`h-full bg-indigo-500 transition-all duration-500 ${totalResource > 100 ? 'bg-rose-500' : ''}`}
            style={{ width: `${Math.min(totalResource, 120)}%` }}
          ></div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-slate-800 space-y-1">
            タイトル
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="小さく試す施策名"
            />
          </label>
          <label className="text-sm font-semibold text-slate-800 space-y-1">
            対応するアイデア
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white"
              value={ideaId}
              onChange={(e) => setIdeaId(e.target.value)}
            >
              <option value="">(任意で紐付け)</option>
              {ideas.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2 text-sm font-semibold text-slate-800 space-y-1">
            メモ
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 min-h-[72px]"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="仮説の背景や KPI"
            />
          </label>
          <div className="md:col-span-2 flex justify-end">
            <button
              className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700"
              onClick={addHypothesis}
            >
              ボードに追加
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {hypotheses.map((h) => (
          <div key={h.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="text-base font-bold text-slate-900">{h.title}</div>
                <div className="text-xs text-slate-500">{h.memo || 'メモなし'}</div>
              </div>
              <StatusSelect value={h.status} onChange={(v) => updateHypothesis(h.id, { status: v })} />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="px-2 py-1 rounded-full bg-slate-50">リソース {h.resource}%</span>
              <input
                type="range"
                min={0}
                max={50}
                value={h.resource}
                onChange={(e) => updateHypothesis(h.id, { resource: Number(e.target.value) })}
              />
              {h.ideaId && (
                <span className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">アイデア連携</span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="font-semibold text-slate-800">進捗ログ: {h.logs.length}件</div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs"
                  onClick={() => updateHypothesis(h.id, { resource: Math.min(100, h.resource + 5) })}
                >
                  +5%
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs"
                  onClick={() => setOpenLogId(h.id)}
                >
                  ログを記録
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <QuickLogPanel
        open={Boolean(openLogId)}
        hypothesis={selectedHypothesis}
        onClose={() => setOpenLogId(null)}
        onSave={(log: QuickLog) => {
          if (!selectedHypothesis) return;
          updateHypothesis(selectedHypothesis.id, { logs: [...selectedHypothesis.logs, log] });
        }}
      />
    </div>
  );
};
