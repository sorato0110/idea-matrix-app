import type { ZoneKey, KpiLabels, HypothesisStatus } from './types.ts';

export const STORAGE_KEYS = {
  ideas: 'banditIdeas',
  hypotheses: 'banditHypotheses',
  experiments: 'banditExperiments',
  trackers: 'banditConfidence',
  labels: 'banditLabels',
};

export const ZONES: Record<ZoneKey, { label: string; description: string; color: string; bg: string }> = {
  quickWins: { label: 'Quick Wins', description: 'Impact高 / Cost低。今すぐ着手', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  majorProjects: { label: 'Major Projects', description: 'Impact高 / Cost高。計画的に', color: 'text-indigo-700', bg: 'bg-indigo-50' },
  fillIns: { label: 'Fill-ins', description: 'Impact低 / Cost低。余裕があれば', color: 'text-slate-700', bg: 'bg-slate-50' },
  ignore: { label: 'Ignore', description: 'Impact低 / Cost高。いったん保留', color: 'text-rose-700', bg: 'bg-rose-50' },
};

export const STATUSES: { key: HypothesisStatus; label: string; color: string; ring: string }[] = [
  { key: 'Trial', label: 'Trial', color: 'bg-indigo-100 text-indigo-700', ring: 'ring-indigo-200' },
  { key: 'Focus', label: 'Focus', color: 'bg-emerald-100 text-emerald-700', ring: 'ring-emerald-200' },
  { key: 'Sustain', label: 'Sustain', color: 'bg-slate-100 text-slate-700', ring: 'ring-slate-200' },
  { key: 'Drop', label: 'Drop', color: 'bg-rose-100 text-rose-700', ring: 'ring-rose-200' },
  { key: 'Completed', label: 'Completed', color: 'bg-amber-100 text-amber-700', ring: 'ring-amber-200' },
];

export const DEFAULT_LABELS: KpiLabels = {
  reach: 'Reach',
  response: 'Response',
  revenue: 'Sales',
};
