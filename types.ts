export type ZoneKey = 'quickWins' | 'majorProjects' | 'fillIns' | 'ignore';

export type Idea = {
  id: string;
  title: string;
  note: string;
  impact: number;
  cost: number;
  createdAt: string;
  score: number;
  zone: ZoneKey;
};

export type HypothesisStatus = 'Trial' | 'Focus' | 'Sustain' | 'Drop' | 'Completed';

export type QuickLog = {
  id: string;
  date: string;
  kpi: number;
  note: string;
};

export type Hypothesis = {
  id: string;
  title: string;
  ideaId?: string;
  status: HypothesisStatus;
  resource: number;
  memo: string;
  logs: QuickLog[];
};

export type ExperimentLog = {
  id: string;
  ideaId?: string;
  period: string;
  metrics: Record<string, number>;
  summary: string;
  tag: '++' | '--';
};

export type ConfidenceTracker = {
  id: string;
  ideaId?: string;
  confidence: number;
  direction: '++' | '--';
  reason: string;
};

export type KpiLabels = {
  reach: string;
  response: string;
  revenue: string;
};
