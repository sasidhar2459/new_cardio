// Metrics page static data — swap to API in Phase 2

export const baselineItems = [
  'Labs',
  'Imaging',
  'Medical history',
  'Lifestyle',
  'Wearable trends',
];

export const progressMetrics = [
  { label: 'ApoB',               direction: 'down' as const, good: true  },
  { label: 'CRP',                direction: 'down' as const, good: true  },
  { label: 'Blood pressure',     direction: 'down' as const, good: true  },
  { label: 'VO₂ max',            direction: 'up'   as const, good: true  },
  { label: 'Body fat %',         direction: 'down' as const, good: true  },
  { label: 'Resting heart rate', direction: 'down' as const, good: true  },
  { label: 'Sleep quality',      direction: 'up'   as const, good: true  },
];

export const keyMetrics = [
  { label: 'LDL & ApoB',         desc: 'Primary plaque-driving particles'         },
  { label: 'Triglycerides',       desc: 'Metabolic fat load indicator'             },
  { label: 'hs-CRP',             desc: 'Silent inflammation marker'               },
  { label: 'Blood Pressure',      desc: 'Arterial force — tracked 24/7'           },
  { label: 'Glucose & HOMA-IR',   desc: 'Insulin resistance early warning'        },
  { label: 'Weight & Body Fat',   desc: 'Metabolic health composition'            },
  { label: 'VO₂ Max',            desc: 'Cardiovascular engine capacity'           },
  { label: 'Steps',               desc: 'Daily movement load'                     },
  { label: 'HRV',                 desc: 'Autonomic nervous system resilience'     },
  { label: 'Sleep Patterns',      desc: 'Recovery quality & cardiac impact'       },
];

// Metrics dashboard data
export const metricsDashboardCards = [
  { id: 'apob',   label: 'ApoB',          value: '82',   unit: 'mg/dL',     color: '#a855f7', target: '< 80',   status: 'Near optimal', trend: [112,105,98,92,88,85,82] },
  { id: 'crp',    label: 'hs-CRP',         value: '1.2',  unit: 'mg/L',      color: '#3b82f6', target: '< 1.0',  status: 'Near optimal', trend: [4.8,4.0,3.2,2.5,1.9,1.5,1.2] },
  { id: 'sbp',    label: 'Systolic BP',    value: '118',  unit: 'mmHg',      color: '#ef4444', target: '< 120',  status: 'Normal',        trend: [148,142,135,130,126,121,118] },
  { id: 'vo2',    label: 'VO₂ Max',        value: '48',   unit: 'ml/kg/min', color: '#10b981', target: '> 45',   status: 'Good',          trend: [34,37,40,43,45,47,48] },
  { id: 'fat',    label: 'Body Fat',       value: '19',   unit: '%',         color: '#f59e0b', target: '< 20%',  status: 'Healthy',       trend: [28,26,24,22,21,20,19] },
  { id: 'rhr',    label: 'Resting HR',     value: '61',   unit: 'bpm',       color: '#f97316', target: '< 65',   status: 'Optimal',       trend: [82,78,74,70,67,63,61] },
  { id: 'sleep',  label: 'Sleep Quality',  value: '87',   unit: '%',         color: '#8b5cf6', target: '> 80%',  status: 'Good',          trend: [58,64,69,74,79,83,87] },
  { id: 'hrv',    label: 'HRV',            value: '64',   unit: 'ms',        color: '#06b6d4', target: '> 55',   status: 'Good',          trend: [34,40,46,52,57,61,64] },
  { id: 'steps',  label: 'Daily Steps',    value: '9,240',unit: '/day',      color: '#22c55e', target: '> 8,000',status: 'On Track',      trend: [5500,6200,7100,7800,8400,9000,9240] },
];

export const metricsHistory = [
  { date: 'Feb 2026', apob: 82,  crp: 1.2, sbp: 118, vo2: 48, bodyFat: 19, rhr: 61 },
  { date: 'Jan 2026', apob: 88,  crp: 1.8, sbp: 124, vo2: 46, bodyFat: 21, rhr: 64 },
  { date: 'Dec 2025', apob: 95,  crp: 2.4, sbp: 130, vo2: 43, bodyFat: 23, rhr: 68 },
  { date: 'Nov 2025', apob: 102, crp: 3.1, sbp: 138, vo2: 40, bodyFat: 25, rhr: 72 },
  { date: 'Oct 2025', apob: 112, crp: 4.8, sbp: 148, vo2: 34, bodyFat: 28, rhr: 82 },
];

export const populationStats = [
  { label: 'Average ApoB reduction',          value: '−18%' },
  { label: 'Average BP improvement',           value: '−11 mmHg' },
  { label: 'Average VO₂ max gain',             value: '+14%' },
  { label: 'Members reaching optimal range',   value: '73%' },
  { label: 'Reduction in 10-year risk',        value: '−22%' },
];
