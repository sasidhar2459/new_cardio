// Wearables page static data — swap to API in Phase 2

export const mockDevices = [
  { id: '1', name: 'Apple Watch Series 9',    battery: 87, type: 'Smart Watch'     },
  { id: '2', name: 'Samsung Galaxy Watch 6',  battery: 64, type: 'Smart Watch'     },
  { id: '3', name: 'Fitbit Sense 2',          battery: 92, type: 'Fitness Tracker' },
  { id: '4', name: 'Garmin Fenix 7',          battery: 71, type: 'Sports Watch'    },
  { id: '5', name: 'Oura Ring Gen 3',         battery: 45, type: 'Smart Ring'      },
  { id: '6', name: 'Whoop 4.0',               battery: 88, type: 'Fitness Tracker' },
  { id: '7', name: 'Pixel Watch 2',           battery: 34, type: 'Smart Watch'     },
  { id: '8', name: 'Withings ScanWatch',      battery: 78, type: 'Hybrid Watch'    },
];

export const dashboardMetrics = [
  { id: 'hr',       label: 'Heart Rate',  value: '72',      unit: 'bpm',   icon: 'heart',    color: '#ef4444', bg: '#1f0a0a', trend: [68,72,75,70,74,72,71,73,72] },
  { id: 'calories', label: 'Calories',    value: '1,840',   unit: 'kcal',  icon: 'flame',    color: '#f97316', bg: '#1f100a', trend: [1200,1450,1600,1820,1700,1840,1900] },
  { id: 'steps',    label: 'Steps',       value: '11,200',  unit: 'steps', icon: 'walk',     color: '#22c55e', bg: '#0a1f0f', trend: [6000,7500,9000,10200,11200,10800,11200] },
  { id: 'sleep',    label: 'Sleep',       value: '7h 45m',  unit: '',      icon: 'moon',     color: '#a855f7', bg: '#130a1f', trend: [6.5,7,6,7.5,8,7.75,7.5] },
  { id: 'weight',   label: 'Weight',      value: '74.2',    unit: 'kg',    icon: 'scale',    color: '#3b82f6', bg: '#0a0f1f', trend: [76,75.5,75,74.8,74.5,74.3,74.2] },
  { id: 'training', label: 'Training',    value: '2h 30m',  unit: '',      icon: 'barbell',  color: '#eab308', bg: '#1f1a0a', trend: [0,1.5,2,0,2.5,1,2.5] },
];

export const whyPoints = [
  'Detect early warning signs',
  'Catch subclinical changes',
  'Personalize medication',
  'Improve lifestyle coaching',
  'Strengthen long-term outcomes',
];

export const trackedData = [
  { label: 'Blood Pressure',     desc: 'Morning & evening readings'         },
  { label: 'Weight',             desc: 'Real trends, not fluctuations'       },
  { label: 'Steps & Activity',   desc: 'Daily baseline movement'             },
  { label: 'Sleep Quality',      desc: 'Recovery & stress signals'           },
  { label: 'Heart Rate & HRV',   desc: 'Autonomic balance'                   },
  { label: 'ECG',                desc: 'Rhythm support when available'       },
  { label: 'Medication Reminders', desc: 'Adherence matters'                 },
];

// phone showcase cards — each has a bg color stand-in (replace with real photos Phase 2)
export const wearableCards = [
  {
    category: 'Active Aging',
    metric: '0.8',
    unit: '',
    label: 'DUNEDINPACE',
    trend: [68, 62, 55, 48, 42, 36, 28],
    bg: '#2a1f18',
  },
  {
    category: 'Reverse Undiagnosed Symptoms',
    metric: '12.4',
    unit: 'mg/L',
    label: 'HSCRP',
    trend: [72, 65, 58, 50, 42, 34, 24],
    bg: '#1a1a1a',
  },
  {
    category: 'Manage Existing Chronic Conditions',
    metric: '5.2%',
    unit: '',
    label: 'HbA1c',
    trend: [65, 60, 55, 50, 44, 38, 30],
    bg: '#1e2a1e',
  },
  {
    category: 'Prevent Future Diseases',
    metric: '1.0',
    unit: '',
    label: 'HOMA-IR',
    trend: [70, 63, 56, 48, 40, 32, 22],
    bg: '#111418',
  },
  {
    category: 'Cardiac Protection',
    metric: '118',
    unit: 'mmHg',
    label: 'SYSTOLIC BP',
    trend: [75, 70, 64, 57, 50, 43, 35],
    bg: '#1a1820',
  },
  {
    category: 'Metabolic Resilience',
    metric: '48',
    unit: 'ml/kg',
    label: 'VO₂ MAX',
    trend: [25, 30, 36, 42, 47, 52, 58],
    bg: '#151e18',
  },
];
