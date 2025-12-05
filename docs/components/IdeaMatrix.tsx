import React, { useMemo, useState } from 'https://esm.sh/react@18?dev&jsx=automatic';
import { ZONES } from '../constants.ts';
import type { Idea, ZoneKey } from '../types.ts';

const calcZone = (impact: number, cost: number): ZoneKey => {
  if (impact >= 4 && cost <= 3) return 'quickWins';
  if (impact >= 4 && cost >= 4) return 'majorProjects';
  if (impact <= 3 && cost <= 3) return 'fillIns';
  return 'ignore';
};

const calcScore = (impact: number, cost: number) => impact + (6 - cost);

const ZoneBadge = ({ zone }: { zone: ZoneKey }) => (
  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ZONES[zone].bg} ${ZONES[zone].color}`}>
    {ZONES[zone].label}
  </span>
);

const ScaleInput = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <label className="space-y-2 font-semibold text-slate-800">
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <span className="text-xs text-slate-500">1〜5</span>
    </div>
    <div className="grid grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-10 rounded-xl border transition ${
            value === n
              ? 'bg-white border-indigo-200 text-indigo-700 shadow-sm'
              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  </label>
);

const IdeaForm = ({ onAdd }: { onAdd: (idea: Idea) => void }) => {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [impact, setImpact] = useState(4);
  const [cost, setCost] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const zone = calcZone(impact, cost);
    const score = calcScore(impact, cost);
    const idea: Idea = {
      id: crypto.randomUUID(),
      title: title.trim(),
      note,
      impact,
      cost,
      createdAt: new Date().toISOString(),
      zone,
      score,
    };
    onAdd(idea);
    setTitle('');
    setNote('');
    setImpact(4);
    setCost(3);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4 animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">＋</div>
        <div>
          <div className="text-lg font-bold text-slate-900">アイデアを追加</div>
          <p className="text-sm text-slate-600">Impact と Cost をセットしてマッピングします。</p>
        </div>
      </div>
      <form className="grid md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
        <label className="font-semibold text-slate-800 space-y-2">
          タイトル
          <input
            className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 新しいLPをABテスト"
            required
          />
        </label>
        <label className="font-semibold text-slate-800 space-y-2">
          メモ
          <textarea
            className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white focus:ring-2 focus:ring-indigo-200 min-h-[64px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="背景や仮説をメモ"
          />
        </label>
        <ScaleInput label="Impact (効果)" value={impact} onChange={setImpact} />
        <ScaleInput label="Cost (工数)" value={cost} onChange={setCost} />
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 transition"
          >
            マップに追加
          </button>
        </div>
      </form>
    </div>
  );
};

const MatrixChart = ({ ideas }: { ideas: Idea[] }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-fadeIn">
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-lg font-bold text-slate-900">Impact × Cost マトリクス</div>
        <p className="text-sm text-slate-600">象限で優先度を視覚化します。Impactは上方向、Costは右方向。</p>
      </div>
    </div>
    <div className="relative h-80 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
        {Array.from({ length: 25 }).map((_, idx) => (
          <div key={idx} className="border border-slate-100"></div>
        ))}
      </div>
      <div className="absolute top-2 left-3 text-xs font-semibold text-slate-500">Impact ↑</div>
      <div className="absolute bottom-2 right-3 text-xs font-semibold text-slate-500">Cost →</div>
      <div className="relative w-full h-full">
        {ideas.map((idea) => {
          const top = ((5 - idea.impact) / 5) * 100;
          const left = ((idea.cost - 1) / 5) * 100;
          return (
            <div
              key={idea.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-sm border border-white/70 ${ZONES[idea.zone].bg}`}
              >
                <div className={`w-3 h-3 rounded-full ${ZONES[idea.zone].bg.replace('50', '400')}`}></div>
                <div className="text-xs font-semibold text-slate-800 max-w-[140px] line-clamp-2">{idea.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const IdeaList = ({ ideas, onDelete }: { ideas: Idea[]; onDelete: (id: string) => void }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 animate-fadeIn">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-lg font-bold text-slate-900">スコア順リスト</div>
        <p className="text-sm text-slate-600">Impact + (6 - Cost) で並べ替えています。</p>
      </div>
      <div className="text-xs text-slate-500">全 {ideas.length} 件</div>
    </div>
    <div className="space-y-3">
      {ideas.length === 0 && (
        <div className="text-sm text-slate-500 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4">
          まだアイデアがありません。左下のボタンから追加しましょう。
        </div>
      )}
      {ideas.map((idea) => (
        <div
          key={idea.id}
          className="p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition flex flex-col gap-2"
        >
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="text-base font-bold text-slate-900">{idea.title}</div>
              <ZoneBadge zone={idea.zone} />
            </div>
            <button
              className="text-rose-500 text-sm hover:text-rose-600"
              onClick={() => onDelete(idea.id)}
            >
              削除
            </button>
          </div>
          <p className="text-sm text-slate-600">{idea.note || '---'}</p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
            <span className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">Impact: {idea.impact}</span>
            <span className="px-2 py-1 rounded-lg bg-slate-50 text-slate-700 font-semibold">Cost: {idea.cost}</span>
            <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">Score: {idea.score}</span>
            <span className="text-slate-400">{new Date(idea.createdAt).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const IdeaMatrix = ({ ideas, setIdeas }: { ideas: Idea[]; setIdeas: (ideas: Idea[]) => void }) => {
  const sortedIdeas = useMemo(() => [...ideas].sort((a, b) => b.score - a.score), [ideas]);

  const addIdea = (idea: Idea) => setIdeas([...ideas, idea]);
  const deleteIdea = (id: string) => setIdeas(ideas.filter((i) => i.id !== id));

  return (
    <div className="space-y-4">
      <IdeaForm onAdd={addIdea} />
      <MatrixChart ideas={ideas} />
      <IdeaList ideas={sortedIdeas} onDelete={deleteIdea} />
      <div className="fixed bottom-5 right-5 md:hidden">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-indigo-600 text-white font-semibold"
        >
          追加フォームへ
        </a>
      </div>
    </div>
  );
};
