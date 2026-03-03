// Treatment page mock data — swap to API in Phase 2

export const riskLevels = [
  {
    id: 'low',
    label: 'Low Risk',
    icon: 'shield',
    color: '#a3e635',
    borderColor: '#a3e635',
    description: 'Minimal cardiovascular risk factors. Focus on maintaining current lifestyle and routine monitoring.',
    bullets: [
      'Annual cardiac screening',
      'Lifestyle optimization guidance',
      'Baseline biomarker tracking',
      'Nutritional counseling',
    ],
  },
  {
    id: 'moderate',
    label: 'Moderate Risk',
    icon: 'analytics',
    color: '#facc15',
    borderColor: '#facc15',
    description: 'Elevated risk factors identified. Requires active intervention and closer monitoring to prevent progression.',
    bullets: [
      'Quarterly cardiac assessments',
      'Personalized exercise protocol',
      'Medication management if needed',
      'Continuous wearable monitoring',
      'Monthly biomarker review',
    ],
  },
  {
    id: 'high',
    label: 'High Risk',
    icon: 'ribbon',
    color: '#f87171',
    borderColor: '#f87171',
    description: 'Significant risk factors present. Intensive intervention program with dedicated cardiologist oversight.',
    bullets: [
      'Dedicated cardiologist assignment',
      'Bi-weekly clinical check-ins',
      'Advanced imaging & diagnostics',
      'Tailored pharmacotherapy',
      'Emergency response protocol',
      '24/7 remote monitoring',
    ],
  },
];

export const treatmentPlans = [
  {
    id: 'foundation',
    name: 'Foundation',
    subtitle: 'For low-risk individuals',
    price: '₹12,000',
    period: '/ year',
    highlight: false,
    features: [
      'Comprehensive cardiac risk assessment',
      'Annual blood panel + ECG',
      'Personalized prevention report',
      'Lifestyle & diet consultation',
      'Access to patient portal',
    ],
  },
  {
    id: 'intensive',
    name: 'Intensive',
    subtitle: 'For moderate-risk individuals',
    price: '₹36,000',
    period: '/ year',
    highlight: true,
    features: [
      'Everything in Foundation',
      'Quarterly specialist reviews',
      'Advanced imaging (CT-CAC, Echo)',
      'Continuous wearable monitoring',
      'Dedicated care coordinator',
      'Priority appointment booking',
    ],
  },
  {
    id: 'highrisk',
    name: 'High-Risk Protocol',
    subtitle: 'For high-risk individuals',
    price: '₹72,000',
    period: '/ year',
    highlight: false,
    features: [
      'Everything in Intensive',
      'Named cardiologist ownership',
      'Bi-weekly clinical visits',
      'Full pharmacotherapy support',
      'Emergency response network',
      '24/7 remote monitoring',
      'Family cardiac screening',
    ],
  },
];

export const outcomeStats = [
  { value: '73%', label: 'Reduction in cardiac events among enrolled members' },
  { value: '40%', label: 'Average drop in LDL cholesterol within 6 months' },
  { value: '2.4×', label: 'Better adherence vs standard care' },
  { value: '91%', label: 'Members who avoided hospitalization in year one' },
];

export const whyItWorks = [
  { title: 'Early Detection', body: 'We identify risk markers years before symptoms appear, using advanced biomarkers and imaging.' },
  { title: 'Personalised Protocols', body: 'Every plan is built around your genetics, labs, lifestyle, and risk score — not a generic template.' },
  { title: 'Continuous Oversight', body: 'Wearables + regular lab reviews mean your cardiologist always has a live picture of your heart.' },
  { title: 'Evidence-Based Medicine', body: 'Every intervention follows the latest ACC/AHA guidelines reviewed by our clinical board.' },
  { title: 'Measurable Outcomes', body: 'We track and report your biomarker improvements so you can see progress, not just feel it.' },
];

// Weight trend — 6 months, kg
export const weightChartData = [
  { month: 'Aug', value: 94 },
  { month: 'Sep', value: 91.5 },
  { month: 'Oct', value: 89 },
  { month: 'Nov', value: 86.2 },
  { month: 'Dec', value: 84 },
  { month: 'Jan', value: 81.8 },
];

// HOMA-IR (insulin resistance index) — lower is better
export const homaChartData = [
  { month: 'Aug', value: 4.8 },
  { month: 'Sep', value: 4.2 },
  { month: 'Oct', value: 3.6 },
  { month: 'Nov', value: 2.9 },
  { month: 'Dec', value: 2.4 },
  { month: 'Jan', value: 1.9 },
];

export type BiomarkerStatus = 'optimal' | 'borderline' | 'elevated';

export const biomarkers = [
  { label: 'LDL Cholesterol', value: '98', unit: 'mg/dL', status: 'optimal' as BiomarkerStatus, change: -24, sparkline: [148, 135, 122, 115, 108, 98] },
  { label: 'HbA1c', value: '5.4', unit: '%', status: 'optimal' as BiomarkerStatus, change: -0.8, sparkline: [6.5, 6.1, 5.9, 5.7, 5.5, 5.4] },
  { label: 'hs-CRP', value: '1.2', unit: 'mg/L', status: 'borderline' as BiomarkerStatus, change: -1.6, sparkline: [3.1, 2.6, 2.1, 1.9, 1.5, 1.2] },
  { label: 'Blood Pressure', value: '118/76', unit: 'mmHg', status: 'optimal' as BiomarkerStatus, change: -14, sparkline: [145, 138, 132, 128, 124, 118] },
];
