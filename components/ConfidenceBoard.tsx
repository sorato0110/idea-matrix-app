import React, { useMemo, useState } from 'https://esm.sh/react@18?dev&jsx=automatic';
import { DEFAULT_LABELS } from '../constants.ts';
import type { ConfidenceTracker, ExperimentLog, Idea, KpiLabels } from '../types.ts';

const ExperimentCard = ({ log, labels }: { log: ExperimentLog; labels: KpiLabels }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
    <div className="flex items-center justify-between text-sm">
      <div className="font-semibold text-slate-900">期間: {log.period}</div>
      <span className={`px-2 py-1 text-xs rounded-full ${log.tag === '++' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
        {log.tag === '++' ? 'プラス' : 'マイナス'}
      </span>
    </div>
    <div className="grid grid-cols-3 gap-2 text-xs text-slate-600">
      <div className="p-2 rounded-lg bg-slate-50">
        <div className="font-semibold text-slate-800">{labels.reach}</div>
        <div className="text-lg font-bold text-indigo-700">{log.metrics.reach ?? 0}</div>
      </div>
      <div className="p-2 rounded-lg bg-slate-50">
        <div className="font-semibold text-slate-800">{labels.response}</div>
        <div className="text-lg font-bold text-indigo-700">{log.metrics.response ?? 0}</div>
      </div>
      <div className="p-2 rounded-lg bg-slate-50">
        <div className="font-semibold text-slate-800">{labels.revenue}</div>
        <div className="text-lg font-bold text-indigo-700">{log.metrics.revenue ?? 0}</div>
      </div>
    </div>
    <p className="text-sm text-slate-700 whitespace-pre-wrap">{log.summary}</p>
  </div>
);

export const ConfidenceBoard = ({
  ideas,
  experiments,
  trackers,
  setExperiments,
  setTrackers,
  labels,
  setLabels,
}: {
  ideas: Idea[];
  experiments: ExperimentLog[];
  trackers: ConfidenceTracker[];
  setExperiments: (logs: ExperimentLog[]) => void;
  setTrackers: (logs: ConfidenceTracker[]) => void;
  labels: KpiLabels;
  setLabels: (l: KpiLabels) => void;
}) => {
  const [period, setPeriod] = useState('');
  const [ideaId, setIdeaId] = useState('');
  const [summary, setSummary] = useState('');
  const [tag, setTag] = useState<'++' | '--'>('++');
  const [metrics, setMetrics] = useState<Record<string, number>>({ reach: 0, response: 0, revenue: 0 });
  const [labelForm, setLabelForm] = useState<KpiLabels>(labels || DEFAULT_LABELS);
  const [labelModal, setLabelModal] = useState(false);

  const addExperiment = () => {
    if (!period.trim()) return;
    const log: ExperimentLog = {
      id: crypto.randomUUID(),
      ideaId: ideaId || undefined,
      period,
      metrics,
      summary,
      tag,
    };
    setExperiments([...experiments, log]);
    setPeriod('');
    setSummary('');
    setMetrics({ reach: 0, response: 0, revenue: 0 });
  };

  const updateTracker = (id: string, patch: Partial<ConfidenceTracker>) => {
    setTrackers(trackers.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  };

  const ensureTracker = (ideaId?: string) => {
    if (!ideaId) return;
    if (trackers.some((t) => t.ideaId === ideaId)) return;
    const idea = ideas.find((i) => i.id === ideaId);
    const newTracker: ConfidenceTracker = {
      id: crypto.randomUUID(),
      ideaId,
      confidence: 50,
      direction: '++',
      reason: idea ? idea.title : '',
    };
    setTrackers([...trackers, newTracker]);
  };

  const linkedTrackers = useMemo(
    () => trackers.map((t) => ({ ...t, ideaTitle: ideas.find((i) => i.id === t.ideaId)?.title ?? '（未連携）' })),
    [trackers, ideas]
  );

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-900">実験ログ</div>
            <p className="text-sm text-slate-600">期間と結果、成功/失敗タグを残します。</p>
          </div>
          <button className="text-xs text-indigo-600 underline" onClick={() => setLabelModal(true)}>
            KPIラベルを編集
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <label className="text-sm font-semibold text-slate-800 space-y-1">
            期間
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              placeholder="例: 4/1-4/14"
            />
          </label>
          <label className="text-sm font-semibold text-slate-800 space-y-1">
            対応アイデア
            <select
              className="w-full rounded-xl border border-slate-200 px-3 py-2 bg-white"
              value={ideaId}
              onChange={(e) => {
                setIdeaId(e.target.value);
                ensureTracker(e.target.value);
              }}
            >
              <option value="">(任意)</option>
              {ideas.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(metrics) as (keyof typeof metrics)[]).map((key) => (
              <label key={key} className="text-sm font-semibold text-slate-800 space-y-1">
                {labelForm[key]}
                <input
                  type="number"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  value={metrics[key] ?? 0}
                  onChange={(e) => setMetrics({ ...metrics, [key]: Number(e.target.value) })}
                />
              </label>
            ))}
          </div>
          <label className="md:col-span-2 text-sm font-semibold text-slate-800 space-y-1">
            分析メモ
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2 min-h-[72px]"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="成功要因/失敗要因を記載"
            />
          </label>
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-slate-800">タグ</div>
            <div className="flex gap-2">
              {['++', '--'].map((k) => (
                <button
                  key={k}
                  onClick={() => setTag(k as '++' | '--')}
                  className={`px-3 py-2 rounded-lg border text-sm ${
                    tag === k ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-200'
                  }`}
                >
                  {k === '++' ? 'プラス' : 'マイナス'}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              className="px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700"
              onClick={addExperiment}
            >
              ログを保存
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {experiments.map((log) => (
          <ExperimentCard key={log.id} log={log} labels={labels} />
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
        <div className="text-lg font-bold text-slate-900">自信度トラッカー</div>
        <p className="text-sm text-slate-600">実験結果を踏まえて主観確率をアップデート。</p>
        <div className="grid md:grid-cols-2 gap-3">
          {linkedTrackers.map((t) => (
            <div key={t.id} className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{t.ideaTitle}</div>
                  <div className="text-xs text-slate-500">自信度 {t.confidence}%</div>
                </div>
                <select
                  className="px-2 py-2 rounded-lg border border-slate-200 text-sm"
                  value={t.direction}
                  onChange={(e) => updateTracker(t.id, { direction: e.target.value as '++' | '--' })}
                >
                  <option value="++">プラス</option>
                  <option value="--">マイナス</option>
                </select>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={t.confidence}
                onChange={(e) => updateTracker(t.id, { confidence: Number(e.target.value) })}
                className="w-full"
              />
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                value={t.reason}
                onChange={(e) => updateTracker(t.id, { reason: e.target.value })}
                placeholder="自信度を動かした理由"
              />
            </div>
          ))}
        </div>
      </div>

      {labelModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-30">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-3 animate-fadeIn">
            <div className="text-lg font-bold text-slate-900">KPIラベルを編集</div>
            {(Object.keys(labelForm) as (keyof KpiLabels)[]).map((key) => (
              <label key={key} className="text-sm font-semibold text-slate-800 space-y-1 block">
                {DEFAULT_LABELS[key as keyof KpiLabels]}
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2"
                  value={labelForm[key]}
                  onChange={(e) => setLabelForm({ ...labelForm, [key]: e.target.value })}
                />
              </label>
            ))}
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded-xl border" onClick={() => setLabelModal(false)}>
                キャンセル
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white"
                onClick={() => {
                  setLabels(labelForm);
                  setLabelModal(false);
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
