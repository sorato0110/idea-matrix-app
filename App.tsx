import React, { useEffect, useMemo, useState } from 'https://esm.sh/react@18?dev&jsx=automatic';
import { IdeaMatrix } from './components/IdeaMatrix.tsx';
import { HypothesisBoard } from './components/HypothesisBoard.tsx';
import { ConfidenceBoard } from './components/ConfidenceBoard.tsx';
import { loadFromStorage, saveToStorage } from './services/storage.ts';
import { DEFAULT_LABELS, STORAGE_KEYS } from './constants.ts';
import type { ConfidenceTracker, ExperimentLog, Hypothesis, Idea, KpiLabels } from './types.ts';

const TabButton = ({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) => (
  <button
    className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition shadow-sm border ${
      active ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-700 border-slate-200'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export const App = () => {
  const [tab, setTab] = useState<'matrix' | 'hypo' | 'confidence'>('matrix');
  const [ideas, setIdeas] = useState<Idea[]>(() => loadFromStorage(STORAGE_KEYS.ideas, []));
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>(() => loadFromStorage(STORAGE_KEYS.hypotheses, []));
  const [experiments, setExperiments] = useState<ExperimentLog[]>(() => loadFromStorage(STORAGE_KEYS.experiments, []));
  const [trackers, setTrackers] = useState<ConfidenceTracker[]>(() => loadFromStorage(STORAGE_KEYS.trackers, []));
  const [labels, setLabels] = useState<KpiLabels>(() => loadFromStorage(STORAGE_KEYS.labels, DEFAULT_LABELS));

  useEffect(() => saveToStorage(STORAGE_KEYS.ideas, ideas), [ideas]);
  useEffect(() => saveToStorage(STORAGE_KEYS.hypotheses, hypotheses), [hypotheses]);
  useEffect(() => saveToStorage(STORAGE_KEYS.experiments, experiments), [experiments]);
  useEffect(() => saveToStorage(STORAGE_KEYS.trackers, trackers), [trackers]);
  useEffect(() => saveToStorage(STORAGE_KEYS.labels, labels), [labels]);

  const subtitle = useMemo(() => {
    switch (tab) {
      case 'matrix':
        return 'アイデアをImpact×Costで優先度付けし、戦略マップを描きます。';
      case 'hypo':
        return '小さく試し、リソース配分と進捗をMABのように管理します。';
      default:
        return '実験結果から自信度をアップデートし、主観確率を可視化します。';
    }
  }, [tab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-extrabold">
              BB
            </div>
            <div>
              <h1 className="text-3xl font-black">バンディット×ベイズ戦略</h1>
              <p className="text-sm text-slate-600">Impact×Cost → MAB → Bayesian confidence を一気通貫で。</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </header>

        <div className="flex gap-2">
          <TabButton active={tab === 'matrix'} label="戦略マップ" onClick={() => setTab('matrix')} />
          <TabButton active={tab === 'hypo'} label="仮説検証ボード" onClick={() => setTab('hypo')} />
          <TabButton active={tab === 'confidence'} label="自信度分析" onClick={() => setTab('confidence')} />
        </div>

        {tab === 'matrix' && <IdeaMatrix ideas={ideas} setIdeas={setIdeas} />}
        {tab === 'hypo' && (
          <HypothesisBoard ideas={ideas} hypotheses={hypotheses} setHypotheses={setHypotheses} />
        )}
        {tab === 'confidence' && (
          <ConfidenceBoard
            ideas={ideas}
            experiments={experiments}
            trackers={trackers}
            setExperiments={setExperiments}
            setTrackers={setTrackers}
            labels={labels}
            setLabels={setLabels}
          />
        )}
      </div>
    </div>
  );
};
