import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  Tooltip as ReTooltip,
} from 'recharts';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Icons } from '../../lib/icons';
import {
  riskLevels, treatmentPlans, outcomeStats, whyItWorks,
  monitorDashboard, statusColors,
  type TrendChartConfig, type BiomarkerConfig,
} from '../../data/mock_treatment';
import { useReveal } from '../../hooks/useScrollReveal';
import './TreatmentPage.css';

function ChartTooltip({ active, payload, unit }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rchart-tooltip">
      <span className="rchart-tooltip-label">{p.payload.month ?? p.name}</span>
      <span className="rchart-tooltip-value">{p.value}{unit ? ` ${unit}` : ''}</span>
    </div>
  );
}

function MiniSparkline({ data, color, sparkId }: { data: number[]; color: string; sparkId: string }) {
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={chartData} margin={{ top: 6, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={sparkId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.22} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.7} fill={`url(#${sparkId})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function BiomarkerKpi({ bm }: { bm: BiomarkerConfig }) {
  const col = statusColors[bm.status];
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span className="kpi-label">{bm.label}</span>
        <span className="kpi-pill" style={{ color: col, borderColor: col }}>{bm.status}</span>
      </div>
      <div className="kpi-mid">
        <span className="kpi-value">{bm.value}</span>
        <span className="kpi-unit">{bm.unit}</span>
      </div>
      <MiniSparkline data={bm.sparkline} color={col} sparkId={`spark-${bm.id}`} />
    </div>
  );
}

function TrendOverviewTile({ trendCharts }: { trendCharts: TrendChartConfig[] }) {
  const [weight, homa] = trendCharts;
  const weightBase = weight.data[0].value;
  const homaBase = homa.data[0].value;
  const data = weight.data.map((w, idx) => {
    const h = homa.data[idx];
    return {
      month: w.month,
      weightIndex: (w.value / weightBase) * 100,
      homaIndex: (h.value / homaBase) * 100,
    };
  });

  return (
    <article className="monitor-tile monitor-tile--overview">
      <div className="tile-head">
        <p className="tile-title">Clinical Trend Index</p>
        <p className="tile-sub">Both biomarkers rebased to 100 at baseline</p>
      </div>
      <div className="tile-chart tile-chart--lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis hide />
            <ReTooltip content={<ChartTooltip unit="index" />} cursor={false} />
            <Line type="monotone" dataKey="weightIndex" stroke="#4ade80" strokeWidth={2.4} dot={false} />
            <Line type="monotone" dataKey="homaIndex" stroke="#60a5fa" strokeWidth={2.4} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="overview-legend">
        <span><i style={{ background: '#4ade80' }} />Body Weight Index</span>
        <span><i style={{ background: '#60a5fa' }} />HOMA-IR Index</span>
      </div>
    </article>
  );
}

function BiomarkerDeltaTile({ biomarkers }: { biomarkers: BiomarkerConfig[] }) {
  const data = biomarkers.map((bm) => ({
    name: bm.label.replace(' Cholesterol', ''),
    delta: Math.abs(bm.change),
    status: bm.status,
  }));

  return (
    <article className="monitor-tile monitor-tile--delta">
      <div className="tile-head">
        <p className="tile-title">Delta From Baseline</p>
      </div>
      <div className="tile-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              width={84}
            />
            <Bar dataKey="delta" radius={[0, 8, 8, 0]}>
              {data.map((entry, idx) => (
                <Cell key={`delta-${entry.name}`} fill={statusColors[entry.status]} opacity={0.9 - idx * 0.1} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function StatusMixTile({ biomarkers }: { biomarkers: BiomarkerConfig[] }) {
  const counts: Record<string, number> = { optimal: 0, borderline: 0, elevated: 0 };
  biomarkers.forEach((bm) => { counts[bm.status] += 1; });
  const data = [
    { name: 'Optimal', value: counts.optimal, color: statusColors.optimal },
    { name: 'Borderline', value: counts.borderline, color: statusColors.borderline },
    { name: 'Elevated', value: counts.elevated, color: statusColors.elevated },
  ].filter(item => item.value > 0);

  return (
    <article className="monitor-tile monitor-tile--mix">
      <div className="tile-head">
        <p className="tile-title">Status Mix</p>
      </div>
      <div className="tile-chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={36} outerRadius={62} paddingAngle={3} stroke="none">
              {data.map((entry) => (
                <Cell key={`mix-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mix-legend">
        {data.map((item) => (
          <span key={item.name}><i style={{ background: item.color }} />{item.name} ({item.value})</span>
        ))}
      </div>
    </article>
  );
}

function VelocityTile({ trendCharts }: { trendCharts: TrendChartConfig[] }) {
  const [weight, homa] = trendCharts;
  const data = weight.data.map((w, idx) => ({
    month: w.month,
    value: (w.value / weight.data[0].value) * 50 + (homa.data[idx].value / homa.data[0].value) * 50,
  }));

  return (
    <article className="monitor-tile monitor-tile--velocity">
      <div className="tile-head">
        <p className="tile-title">Risk Load Curve</p>
      </div>
      <div className="tile-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="risk-load-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis hide />
            <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={2.2} fill="url(#risk-load-grad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function TreatmentHero() {
  const imageUrl = 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1400&q=80';

  return (
    <section className="tx-hero">
      <div className="hero-bg-grid" />
      <div className="container">
        <div className="tx-hero-grid">
          <div className="tx-hero-left">
            <p className="section-eyebrow">Treatment</p>
            <h1 className="tx-hero-title">Your Heart.<br />Our <span className="tx-hero-accent">Protocol.</span></h1>
            <p className="tx-hero-sub">
              A precision-driven, cardiologist-led program that identifies your true risk and builds a plan around you - not a generic template.
            </p>
            <div className="tx-hero-actions">
              <IonButton className="btn-white" shape="round" href="/signup">Start Your Assessment</IonButton>
              <IonButton className="btn-outline-white" shape="round" fill="outline" href="/contact">Talk to a Cardiologist</IonButton>
            </div>
          </div>
          <div className="tx-hero-right">
            <div className="tx-hero-image-wrap">
              <img src={imageUrl} alt="Cardiologist consultation" className="tx-hero-image-inner" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="risk-section">
      <div className="container">
        <p className="section-eyebrow">Risk Classification</p>
        <h2 className="section-heading">Know Where You Stand</h2>
        <p className="section-sub">
          Every member starts with a comprehensive assessment. Your risk category shapes your entire care protocol.
        </p>
        <div ref={ref} className={`risk-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {riskLevels.map(level => (
            <div key={level.id} className="risk-card">
              <h3 className="risk-label">{level.label}</h3>
              <p className="risk-desc">{level.description}</p>
              <ul className="risk-bullets">
                {level.bullets.map((b, i) => (
                  <li key={i}><span className="risk-bullet-dot" />{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlansSection() {
  const { ref, visible } = useReveal();
  return (
    <section className="plans-section">
      <div className="container">
        <p className="section-eyebrow">Membership Plans</p>
        <h2 className="section-heading">Choose Your Protocol</h2>
        <div ref={ref} className={`plans-grid ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          {treatmentPlans.map(plan => (
            <div key={plan.id} className={`plan-card ${plan.highlight ? 'plan-card--highlight' : ''}`}>
              {plan.highlight && <div className="plan-badge">Most Popular</div>}
              <p className="plan-name">{plan.name}</p>
              <p className="plan-subtitle">{plan.subtitle}</p>
              <div className="plan-price">
                <span className="plan-price-val">{plan.price}</span>
                <span className="plan-price-period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <IonIcon icon={Icons.checkmark} className="plan-check" />
                    {f}
                  </li>
                ))}
              </ul>
              <IonButton
                className={plan.highlight ? 'btn-white' : 'btn-outline-white'}
                shape="round"
                fill={plan.highlight ? 'solid' : 'outline'}
                href="/signup"
                expand="block"
              >
                Get Started
              </IonButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const { ref, visible } = useReveal();
  return (
    <section className="why-section">
      <div className="container">
        <div ref={ref} className={`why-stack ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <div className="why-intro">
            <p className="section-eyebrow">Why It Works</p>
            <h2 className="section-heading">Science + Personalization.</h2>
          </div>

          <div className="why-reasons">
            <div className="reasons-list">
              {whyItWorks.map((r, i) => (
                <div key={i} className="reason-item">
                  <div className="reason-content">
                    <p className="reason-title">{r.title}</p>
                    <p className="reason-body">{r.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="why-outcomes">
            <p className="section-eyebrow">Outcomes</p>
            <h2 className="section-heading">Numbers that matter.</h2>
            <div className="stat-grid">
              {outcomeStats.map((s, i) => (
                <div key={i} className="stat-item">
                  <p className="stat-value">{s.value}</p>
                  <p className="stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MonitorSection() {
  const { ref, visible } = useReveal(0, 0.03);
  const { trendCharts, biomarkers } = monitorDashboard;

  return (
    <section className="monitor-section">
      <div className="container">
        <p className="section-eyebrow">Live Monitoring</p>
        <h2 className="section-heading">Your Progress, Tracked.</h2>
        <p className="section-sub">
          Real patient data. Every enrolled member gets a live dashboard showing their biomarker trends over time.
        </p>

        <div ref={ref} className={`monitor-dash ${visible ? 'reveal-in' : 'reveal-hidden'}`}>
          <div className="monitor-grid">
            <TrendOverviewTile trendCharts={trendCharts} />
            <StatusMixTile biomarkers={biomarkers} />
            <BiomarkerDeltaTile biomarkers={biomarkers} />
            <VelocityTile trendCharts={trendCharts} />

            <article className="monitor-tile monitor-tile--kpis">
              <div className="tile-head">
                <p className="tile-title">Biomarker Snapshot</p>
              </div>
              <div className="kpi-grid">
                {biomarkers.map((bm) => (
                  <BiomarkerKpi key={bm.id} bm={bm} />
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

const TreatmentPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen scrollY>
        <div className="treatment-page">
          <Navbar />

          <TreatmentHero />
          <RiskSection />
          <PlansSection />
          <WhySection />
          <MonitorSection />
          <Footer />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TreatmentPage;
