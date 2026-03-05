// Risk Assessment page static data — swap to API in Phase 2

export const whyFactorsMatters = [
  { marker: 'ApoB', desc: 'the particle that drives plaque formation in arterial walls' },
  { marker: 'Blood Pressure', desc: 'the force that damages arteries silently over decades' },
  { marker: 'Glucose / HbA1c', desc: 'early warning signal for insulin resistance and diabetes' },
  { marker: 'Inflammation (hs-CRP)', desc: 'accelerates plaque rupture and acute cardiac events' },
  { marker: 'VO₂ Max', desc: 'your resilience reserve — predicts survival under cardiac stress' },
  { marker: 'Coronary Imaging (CAC)', desc: 'no shortcuts, no guesswork — direct plaque visibility' },
];

// Risk dashboard data — mock vitals + history
export const riskDashboardVitals = [
  { label: 'Blood Pressure', value: '128/85', unit: 'mmHg', color: '#ef4444', normal: '120/80', trend: [132,130,135,129,128,126,128] },
  { label: 'Heart Rate',     value: '78',     unit: 'bpm',  color: '#f97316', normal: '60–100', trend: [82,79,77,80,78,75,78] },
  { label: 'LDL',            value: '124',    unit: 'mg/dL',color: '#a855f7', normal: '<100',   trend: [145,138,132,128,126,124,124] },
  { label: 'Blood Glucose',  value: '95',     unit: 'mg/dL',color: '#3b82f6', normal: '70–100', trend: [100,97,99,96,95,94,95] },
  { label: 'SpO₂',           value: '98',     unit: '%',    color: '#10b981', normal: '95–100', trend: [97,98,98,97,98,99,98] },
  { label: 'HbA1c',          value: '5.6',    unit: '%',    color: '#f59e0b', normal: '<5.7',   trend: [5.9,5.8,5.7,5.7,5.6,5.6,5.6] },
];

export const riskHistory = [
  { date: 'Feb 06, 2026', bp: '128/85', hr: 78, weight: 72.0, glucose: 95,  riskScore: 14, level: 'Borderline' },
  { date: 'Jan 15, 2026', bp: '130/87', hr: 80, weight: 72.5, glucose: 98,  riskScore: 16, level: 'Intermediate' },
  { date: 'Dec 20, 2025', bp: '135/90', hr: 82, weight: 73.2, glucose: 102, riskScore: 18, level: 'Intermediate' },
  { date: 'Nov 05, 2025', bp: '138/92', hr: 84, weight: 74.0, glucose: 105, riskScore: 20, level: 'High' },
  { date: 'Oct 10, 2025', bp: '140/93', hr: 85, weight: 74.5, glucose: 108, riskScore: 22, level: 'High' },
  { date: 'Sep 12, 2025', bp: '136/89', hr: 83, weight: 74.0, glucose: 104, riskScore: 19, level: 'High' },
  { date: 'Aug 18, 2025', bp: '133/88', hr: 81, weight: 73.5, glucose: 101, riskScore: 17, level: 'Intermediate' },
  { date: 'Jul 22, 2025', bp: '131/86', hr: 80, weight: 73.1, glucose: 99,  riskScore: 15, level: 'Intermediate' },
  { date: 'Jun 14, 2025', bp: '129/84', hr: 79, weight: 72.8, glucose: 97,  riskScore: 13, level: 'Borderline' },
  { date: 'May 08, 2025', bp: '127/83', hr: 77, weight: 72.3, glucose: 94,  riskScore: 11, level: 'Borderline' },
  { date: 'Apr 01, 2025', bp: '125/82', hr: 76, weight: 71.8, glucose: 92,  riskScore: 9,  level: 'Low' },
  { date: 'Mar 10, 2025', bp: '124/81', hr: 75, weight: 71.5, glucose: 90,  riskScore: 8,  level: 'Low' },
];

// Peer comparison data — age group 45–54 male, per NHANES/ACC-AHA benchmarks
// Phase 2: replace with API call using user's age + sex from profile

export interface PeerMetric {
  key: string;
  label: string;
  unit: string;
  userValue: number;
  userDisplay: string;
  peerMean: number;
  peerSd: number;
  percentile: number;         // % of peers the user is "better than"
  betterDirection: 'lower' | 'higher';
  peerLabel: string;
  peerDisplay: string;
  rangeLabel: [string, string];
}

export const peerComparisonData: PeerMetric[] = [
  {
    key: 'riskScore',
    label: 'Cardiovascular Risk Score',
    unit: '/ 40',
    userValue: 14,
    userDisplay: '14',
    peerMean: 18.5,
    peerSd: 5.0,
    percentile: 62,
    betterDirection: 'lower',
    peerLabel: 'avg for males 45–54',
    peerDisplay: '18.5',
    rangeLabel: ['Low Risk', 'High Risk'],
  },
  {
    key: 'systolicBp',
    label: 'Systolic Blood Pressure',
    unit: 'mmHg',
    userValue: 128,
    userDisplay: '128',
    peerMean: 127,
    peerSd: 16,
    percentile: 48,
    betterDirection: 'lower',
    peerLabel: 'avg for males 45–54',
    peerDisplay: '127',
    rangeLabel: ['90 mmHg', '170 mmHg'],
  },
  {
    key: 'heartRate',
    label: 'Resting Heart Rate',
    unit: 'bpm',
    userValue: 78,
    userDisplay: '78',
    peerMean: 72,
    peerSd: 10,
    percentile: 27,
    betterDirection: 'lower',
    peerLabel: 'avg for males 45–54',
    peerDisplay: '72',
    rangeLabel: ['50 bpm', '100 bpm'],
  },
  {
    key: 'glucose',
    label: 'Fasting Glucose',
    unit: 'mg/dL',
    userValue: 95,
    userDisplay: '95',
    peerMean: 100,
    peerSd: 14,
    percentile: 64,
    betterDirection: 'lower',
    peerLabel: 'avg for males 45–54',
    peerDisplay: '100',
    rangeLabel: ['70 mg/dL', '140 mg/dL'],
  },
  {
    key: 'bmi',
    label: 'Body Mass Index',
    unit: 'kg/m²',
    userValue: 24.9,
    userDisplay: '24.9',
    peerMean: 29.1,
    peerSd: 5.5,
    percentile: 78,
    betterDirection: 'lower',
    peerLabel: 'avg for males 45–54',
    peerDisplay: '29.1',
    rangeLabel: ['18 kg/m²', '42 kg/m²'],
  },
  {
    key: 'tenYearRisk',
    label: '10-Year CVD Risk',
    unit: '%',
    userValue: 7,
    userDisplay: '7%',
    peerMean: 9.5,
    peerSd: 5.0,
    percentile: 60,
    betterDirection: 'lower',
    peerLabel: 'avg for males 45–54',
    peerDisplay: '9.5%',
    rangeLabel: ['<2%', '>20%'],
  },
];

// Step definitions — mirrors old_cardio Flutter form
export const assessmentSteps = [
  { id: 0, title: 'Basic Information',        subtitle: 'Demographics & lifestyle' },
  { id: 1, title: 'Clinical Parameters',      subtitle: 'Blood pressure & lipids' },
  { id: 2, title: 'Risk-Enhancing Factors',   subtitle: 'Advanced biomarkers' },
  { id: 3, title: 'Body Composition',         subtitle: 'Measurements & metrics' },
  { id: 4, title: 'Coronary Artery Calcium',  subtitle: 'CAC score (optional)' },
  { id: 5, title: 'Review & Submit',          subtitle: 'Verify your data' },
];
