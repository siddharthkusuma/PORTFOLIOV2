import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight, ArrowDownRight, Menu, X,
  TrendingUp, BarChart3, PieChart, Terminal, Layers,
  BookOpen, Mail, Linkedin, Download, ChevronRight,
  Shield, Target, FileText, Table2, ExternalLink
} from 'lucide-react';

/* ─── CHART.JS (loaded via CDN in useEffect) ───────────────────────────── */
// No npm import — we load Chart.js from CDN to keep it dependency-free.

/* ─── FALLBACK MARKET DATA ─────────────────────────────────────────────── */
const fallbackData = [
  { name: "S&P 500",  price: "5,157.36",  change: "+1.03%", isUp: true  },
  { name: "DOW",      price: "39,087.38", change: "+0.34%", isUp: true  },
  { name: "NASDAQ",   price: "16,274.94", change: "+1.51%", isUp: true  },
  { name: "NIFTY 50", price: "22,493.55", change: "+0.11%", isUp: true  },
  { name: "FTSE 100", price: "7,692.46",  change: "-0.43%", isUp: false },
  { name: "DAX",      price: "17,814.51", change: "+0.16%", isUp: true  },
  { name: "USD/INR",  price: "83.42",     change: "-0.08%", isUp: false },
  { name: "GOLD",     price: "2,318.40",  change: "+0.52%", isUp: true  },
];

/* ─── METRICS ───────────────────────────────────────────────────────────── */
const metrics = [
  { value: "$3.5M", label: "Series A Modeled",       icon: TrendingUp },
  { value: "50+",   label: "Portfolios · $1.2M AUM", icon: PieChart   },
  { value: "30%",   label: "YoY AUM Growth",          icon: BarChart3  },
  { value: "26.5%", label: "Annual Return Yield",     icon: Target     },
];

/* ─── EXPERIENCE (timeline) ─────────────────────────────────────────────── */
const experience = [
  {
    company:   "Vosyn Inc.",
    role:      "Team Lead, Corporate Finance",
    sub:       "Promoted from FP&A Intern",
    location:  "Chicago, Illinois (Remote)",
    period:    "Jun 2025 – Nov 2025",
    accent:    "emerald",
    bullets: [
      { label: "Equity & Capital Markets",
        text:  "Directed financial modeling for a Series A capital raise of $3.5M — personally constructing integrated 3-statement models and Cap Tables to track equity dilution and calculate share price." },
      { label: "Revenue Strategy",
        text:  "Engineered CPM forecasting revenue models and DCF analyses to evaluate ad-monetization scenarios, delivering data-driven insights directly to the CEO to shape the product roadmap." },
      { label: "Leadership",
        text:  "Bridged communication between IT, Product, and Capital Markets to align 3-day Agile forecasting sprints with long-term revenue targets." },
      { label: "Automation",
        text:  "Developed a Python script to automate sweat equity distribution, matching employee database hours with real-time share price valuations to automate issuance acknowledgments." },
    ],
  },
  {
    company:  "Pravik Advisory LLP",
    role:     "Financial Analyst & Director",
    location: "Hyderabad, India",
    period:   "Dec 2022 – Jul 2024",
    accent:   "slate",
    dark:     true,
    bullets: [
      { label: "Wealth Management",
        text:  "Oversaw financial operations and account segregation for 50+ client portfolios (AUM: ₹10 Cr / ~$1.2M USD), contributing to 30% YoY growth in Assets Under Management." },
      { label: "Quantitative Risk",
        text:  "Applied Modern Portfolio Theory to calculate Value at Risk (VaR), Conditional VaR (CVaR), and standard deviation to manage downside exposure for the firm's asset base." },
      { label: "Market Execution",
        text:  "Managed the end-to-end investment lifecycle — from deriving expected returns via technical modeling to executing trades and managing liquidity through monthly variance analysis." },
    ],
  },
  {
    company:  "Incieve Productions",
    role:     "CEO & Founder",
    location: "Hyderabad, India",
    period:   "2020 – 2024",
    accent:   "slate",
    bullets: [
      { label: "Cost Optimization",
        text:  "Achieved 15–20% cost reductions through rigorous spend analysis and vendor benchmarking." },
      { label: "Financial Modeling",
        text:  "Constructed break-even and scenario models that improved internal payment cycles by 25% to establish sustainable liquidity." },
    ],
  },
];

/* ─── ACADEMIC PROJECTS ─────────────────────────────────────────────────── */
const projects = [
  {
    title:  "Portfolio Optimization & Investment Strategy Analysis",
    period: "Feb 2025 – Apr 2025",
    tags:   ["Advanced Excel — Macros", "R-Programming", "Mean-Variance Optimization"],
    // Key stats from the report — used in the live chart
    stats: { tenYearReturn: 12.7, thirtyYearReturn: 26.5, varTen: -2.87, varThirty: -7.19 },
    files: [
      { label: "Full Report (PDF)", icon: "pdf",   href: "/projects/portfolio-optimization/Final_Report_Quant.pdf" },
      { label: "Excel Model",       icon: "excel", href: "https://drive.google.com/drive/folders/1g0dY1wIVmqrzlqBJY4r7trtuGGWzFl84?usp=share_link" },
    ],
    points: [
      { label: "Portfolio Modeling",
        text:  "Constructed 10-year and 30-year wealth generation models using Mean-Variance Optimization to maximize risk-adjusted returns, yielding a 26.5% annual return." },
      { label: "Efficiency Analysis",
        text:  "Plotted the Efficient Frontier and Capital Market Line (CML) to identify optimal tangency portfolios; validated performance using Sharpe Ratio and Jensen's Alpha." },
      { label: "Risk Quantification",
        text:  "Utilized R-Programming to simulate downside scenarios with a 95% confidence interval, identifying a VaR of -2.87% for conservative strategies." },
    ],
  },
  {
    title:  "Consumer Choice Modeling & Design Decision Analysis",
    period: "Aug 2025 – Dec 2025",
    tags:   ["R-Programming", "Quantitative Choice Modeling", "Survey Analysis"],
    files: [], // placeholder — files coming soon
    points: [
      { label: "Demand Forecasting",
        text:  "Engineered predictive models in R to forecast consumer adoption rates for emerging technologies based on price elasticity and efficiency variables." },
      { label: "Strategic Intelligence",
        text:  "Leveraged quantitative choice modeling to identify optimal price points, translating complex survey data into actionable insights for high-level business decisions." },
    ],
  },
];

/* ─── SKILLS ────────────────────────────────────────────────────────────── */
const skillGroups = [
  {
    title: "Financial", icon: PieChart, color: "emerald",
    items: ['3-Statement Modeling','FP&A','DCF Valuation','Variance Analysis',
      'Capital Budgeting','P&L Analysis','Financial Reporting','Financial Forecasting',
      'Journal & Ledger Entries','Modern Portfolio Theory','VaR / CVaR','GAAP Analysis','Anaplan'],
  },
  {
    title: "Technical", icon: Terminal, color: "dark",
    items: ['SQL','Python','R-Programming','Power BI','Tableau',
      'Advanced Excel (Macros / Power Query)','SAP','Snowflake',
      'Salesforce','NetSuite','SharePoint','Google Workspace'],
  },
  {
    title: "Operations", icon: Layers, color: "slate",
    items: ['Asset Allocation','Root-Cause Analysis','Process Improvement',
      'KPI Development','Ad Hoc Analysis','Resource Management','Agile'],
  },
];

/* ─── ANIMATION VARIANTS ─────────────────────────────────────────────────── */
const fadeUp  = { hidden:{ opacity:0, y:28 }, visible:{ opacity:1, y:0, transition:{ duration:0.55, ease:[0.22,1,0.36,1] } } };
const stagger = { visible:{ transition:{ staggerChildren:0.09 } } };
const fadeLeft= { hidden:{ opacity:0, x:-20 }, visible:{ opacity:1, x:0, transition:{ duration:0.5, ease:[0.22,1,0.36,1] } } };

/* ════════════════════════════════════════════════════════════════════════
   MAGNETIC BUTTON — subtle cursor-tracking translateX/Y on hover
════════════════════════════════════════════════════════════════════════ */
function MagneticBtn({ href, className, children, strength = 0.35 }) {
  const ref = useRef(null);
  const handleMove = useCallback(e => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - (left + width  / 2)) * strength;
    const y = (e.clientY - (top  + height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, [strength]);
  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0,0)';
  }, []);
  return (
    <a ref={ref} href={href}
       className={className}
       style={{ transition:'transform 0.25s cubic-bezier(0.22,1,0.36,1)' }}
       onMouseMove={handleMove}
       onMouseLeave={handleLeave}>
      {children}
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PORTFOLIO CHART — live Chart.js 30-year growth comparison
   Uses real data from the report: 26.5% avg yearly (30yr), 12.7% (10yr),
   S&P 500 long-run ~10.5% benchmark
════════════════════════════════════════════════════════════════════════ */
function PortfolioChart() {
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);
  const [mode, setMode] = useState('30yr'); // '30yr' | '10yr'

  useEffect(() => {
    // Load Chart.js from CDN if not already present
    if (!window.Chart) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
      script.onload = () => buildChart();
      document.head.appendChild(script);
    } else {
      buildChart();
    }
    return () => { if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; } };
  }, []);

  useEffect(() => {
    if (window.Chart && chartRef.current) rebuildChart();
  }, [mode]);

  function generateGrowth(years, annualReturn, initial = 100000) {
    const data = [];
    let val = initial;
    for (let y = 0; y <= years; y++) {
      data.push(Math.round(val));
      val *= (1 + annualReturn / 100);
    }
    return data;
  }

  function getConfig() {
    const years   = mode === '30yr' ? 30 : 10;
    const ret     = mode === '30yr' ? 26.5 : 12.7;
    const labels  = Array.from({ length: years + 1 }, (_, i) => `Year ${i}`);
    const portData= generateGrowth(years, ret);
    const spData  = generateGrowth(years, 10.5);
    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `Optimized Portfolio (${ret}% avg)`,
            data: portData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.08)',
            borderWidth: 2.5,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#10b981',
            fill: true,
            tension: 0.4,
          },
          {
            label: 'S&P 500 Benchmark (~10.5%)',
            data: spData,
            borderColor: '#475569',
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderDash: [5, 4],
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#475569',
            fill: false,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#64748b',
              font: { size: 11, weight: '600' },
              boxWidth: 24,
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 12,
            },
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#94a3b8',
            bodyColor: '#f1f5f9',
            borderColor: '#1e293b',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: ctx => ` $${ctx.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#94a3b8', font: { size: 10 },
              maxTicksLimit: mode === '30yr' ? 7 : 6,
              callback: (_, i) => `Yr ${i}`,
            },
            grid: { color: 'rgba(148,163,184,0.1)' },
            border: { display: false },
          },
          y: {
            ticks: {
              color: '#94a3b8', font: { size: 10 },
              callback: v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}k`,
            },
            grid: { color: 'rgba(148,163,184,0.1)' },
            border: { display: false },
          },
        },
      },
    };
  }

  function buildChart() {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new window.Chart(canvasRef.current, getConfig());
  }

  function rebuildChart() {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new window.Chart(canvasRef.current, getConfig());
  }

  const finalVal30 = Math.round(100000 * Math.pow(1.265, 30));
  const finalVal10 = Math.round(100000 * Math.pow(1.127, 10));
  const finalVal   = mode === '30yr' ? finalVal30 : finalVal10;
  const spFinal30  = Math.round(100000 * Math.pow(1.105, 30));
  const spFinal10  = Math.round(100000 * Math.pow(1.105, 10));
  const spFinal    = mode === '30yr' ? spFinal30 : spFinal10;
  const fmt = v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}k`;

  return (
    <div className="bg-slate-950 rounded-[28px] p-6 md:p-8 mt-6">
      {/* header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-1">Live Model</p>
          <h4 className="text-white font-black text-lg tracking-tight">
            {mode === '30yr' ? '30-Year' : '10-Year'} Portfolio Growth
          </h4>
          <p className="text-slate-500 text-xs mt-0.5">Starting investment: $100,000</p>
        </div>
        {/* toggle */}
        <div className="flex items-center gap-1 bg-slate-800 rounded-full p-1">
          {['10yr','30yr'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                mode===m ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}>{m === '30yr' ? '30 Year' : '10 Year'}</button>
          ))}
        </div>
      </div>

      {/* stat pills */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-emerald-950/60 border border-emerald-900/50 rounded-2xl p-4">
          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Optimized Portfolio</p>
          <p className="text-2xl font-black text-white">{fmt(finalVal)}</p>
          <p className="text-emerald-400 text-xs font-semibold mt-0.5">
            {mode==='30yr' ? '26.5%' : '12.7%'} avg annual return
          </p>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">S&P 500 Benchmark</p>
          <p className="text-2xl font-black text-slate-300">{fmt(spFinal)}</p>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">~10.5% long-run average</p>
        </div>
      </div>

      {/* chart */}
      <div style={{ height: 240 }}>
        <canvas ref={canvasRef}/>
      </div>

      {/* risk note */}
      <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest">
        <span className="text-slate-600">
          VaR (95%): <span className="text-rose-400">{mode==='30yr' ? '-7.19%' : '-2.87%'} / mo</span>
        </span>
        <span className="text-slate-600">
          CVaR (95%): <span className="text-rose-400">{mode==='30yr' ? '-9.50%' : '-4.10%'} / mo</span>
        </span>
        <span className="text-slate-600">
          Sharpe: <span className="text-emerald-400">{mode==='30yr' ? 'Higher' : 'Lower'} ratio</span>
        </span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PROJECT FILES BUTTON GROUP
════════════════════════════════════════════════════════════════════════ */
function ProjectFiles({ files }) {
  if (!files || files.length === 0) {
    return (
      <div className="mt-6 flex items-center gap-3 py-3 px-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="w-7 h-7 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
          <FileText size={13} className="text-slate-400"/>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500">Project files coming soon</p>
          <p className="text-[10px] text-slate-400">Report & analysis will be uploaded shortly</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {files.map(f => (
        <a key={f.label} href={f.href} target="_blank" rel="noreferrer"
           className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border transition-all hover:-translate-y-0.5 ${
             f.icon === 'pdf'
               ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 hover:shadow-md hover:shadow-rose-100'
               : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:shadow-md hover:shadow-emerald-100'
           }`}
           style={{ transition:'transform 0.2s ease, box-shadow 0.2s ease' }}>
          {f.icon === 'pdf'
            ? <FileText size={12}/>
            : <Table2 size={12}/>}
          {f.label}
          <ExternalLink size={10} className="opacity-50"/>
        </a>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   ANIMATED TIMELINE ITEM
════════════════════════════════════════════════════════════════════════ */
function TimelineItem({ job, index, isLast }) {
  const [open, setOpen] = useState(index === 0);
  const isEmerald = job.accent === 'emerald';

  return (
    <div className="flex gap-5 md:gap-8">
      {/* left: dot + line */}
      <div className="flex flex-col items-center pt-1 shrink-0" style={{ width: 20 }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15, duration: 0.4, ease: [0.22,1,0.36,1] }}
          className={`w-4 h-4 rounded-full border-2 shrink-0 ${
            isEmerald && index === 0
              ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30'
              : 'bg-white border-slate-300'
          }`}
          style={isEmerald && index === 0 ? {} : {}}
        >
          {isEmerald && index === 0 && (
            <span className="absolute w-4 h-4 rounded-full bg-emerald-500 animate-ping opacity-40"/>
          )}
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 + 0.3, duration: 0.6, ease: 'easeOut' }}
            style={{ transformOrigin: 'top', flex: 1, width: 1.5, marginTop: 6,
                     background: 'linear-gradient(to bottom, #10b981, #e2e8f0)' }}
          />
        )}
      </div>

      {/* right: card */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.12, duration: 0.55, ease: [0.22,1,0.36,1] }}
        className={`flex-1 mb-10 rounded-[28px] border overflow-hidden transition-shadow hover:shadow-lg ${
          job.dark
            ? 'bg-slate-950 border-slate-800'
            : index === 0
              ? 'bg-white border-slate-200 shadow-xl'
              : 'bg-emerald-50 border-emerald-100'
        }`}
      >
        {/* card header — clickable to expand/collapse */}
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full text-left px-8 py-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
        >
          <div>
            <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tight ${job.dark?'text-white':'text-slate-950'}`}>
              {job.company}
            </h3>
            <p className={`font-bold text-xs uppercase tracking-widest mt-1 font-mono ${job.dark?'text-emerald-400':'text-emerald-700'}`}>
              {job.role}
            </p>
            {job.sub      && <p className={`text-xs font-semibold mt-0.5 ${job.dark?'text-slate-400':'text-slate-500'}`}>{job.sub}</p>}
            {job.location && <p className={`text-xs mt-0.5 ${job.dark?'text-slate-500':'text-slate-400'}`}>{job.location}</p>}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`font-mono text-xs font-bold px-3 py-1.5 rounded-full border ${
              job.dark ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500 bg-white'
            }`}>{job.period}</span>
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}
              className={`w-6 h-6 rounded-full flex items-center justify-center ${job.dark?'bg-slate-800 text-slate-400':'bg-slate-100 text-slate-500'}`}>
              <ChevronRight size={13} className="rotate-90"/>
            </motion.div>
          </div>
        </button>

        {/* expandable bullets */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="bullets"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
              className="overflow-hidden"
            >
              <div className={`px-8 pb-8 grid grid-cols-1 ${job.bullets.length > 2 ? 'md:grid-cols-2' : ''} gap-4 text-sm leading-relaxed border-t ${job.dark?'border-slate-800':'border-slate-100'} pt-5`}>
                {job.bullets.map((b, j) => (
                  <div key={j} className={job.dark?'text-slate-400':'text-slate-600'}>
                    {b.label && <span className={`font-bold ${job.dark?'text-white':'text-slate-900'}`}>{b.label}: </span>}
                    <span>{b.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   APP
════════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [marketData, setMarketData]       = useState(fallbackData);
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => { document.title = "Siddharth Kusuma | Financial Analyst"; }, []);

  /* ── LIVE PRICES ─────────────────────────────────────────────────────
     All 8 symbols fetched live. Three CORS proxies tried per symbol —
     if all fail for one symbol it keeps its fallback so others still show.
     Refreshes every 60 s.
  ─────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const symbols = [
      { name:"S&P 500",  ticker:"^GSPC",   fb: fallbackData[0] },
      { name:"DOW",      ticker:"^DJI",    fb: fallbackData[1] },
      { name:"NASDAQ",   ticker:"^IXIC",   fb: fallbackData[2] },
      { name:"NIFTY 50", ticker:"^NSEI",   fb: fallbackData[3] },
      { name:"FTSE 100", ticker:"^FTSE",   fb: fallbackData[4] },
      { name:"DAX",      ticker:"^GDAXI",  fb: fallbackData[5] },
      { name:"USD/INR",  ticker:"USDINR=X",fb: fallbackData[6] },
      { name:"GOLD",     ticker:"GC=F",    fb: fallbackData[7] },
    ];
    const proxies = [
      u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
      u => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
      u => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
    ];
    const fetchOne = async (item) => {
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${item.ticker}`;
      for (const makeProxy of proxies) {
        try {
          const res  = await fetch(makeProxy(yahooUrl), { signal: AbortSignal.timeout(6000) });
          if (!res.ok) continue;
          const data = await res.json();
          const meta  = data?.chart?.result?.[0]?.meta;
          if (!meta) continue;
          const price = meta.regularMarketPrice;
          const prev  = meta.chartPreviousClose || meta.previousClose || price;
          const diff  = ((price - prev) / prev) * 100;
          return {
            name:   item.name,
            price:  price.toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 }),
            change: `${diff>=0?'+':''}${diff.toFixed(2)}%`,
            isUp:   diff >= 0,
          };
        } catch { /* try next proxy */ }
      }
      return item.fb;
    };
    const fetch_prices = async () => {
      const results = await Promise.all(symbols.map(fetchOne));
      setMarketData(results);
    };
    fetch_prices();
    const iv = setInterval(fetch_prices, 60000);
    return () => clearInterval(iv);
  }, []);

  /* active section */
  useEffect(() => {
    const ids = ['about','experience','projects','skills','education','contact'];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin:'-40% 0px -50% 0px' }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const navLinks = ['About','Experience','Projects','Skills','Education','Contact'];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-emerald-100">

      {/* ── TICKER ─────────────────────────────────────────────────────── */}
      <div className="fixed top-0 w-full z-[70] h-9 bg-slate-950 flex items-center overflow-hidden border-b border-slate-800">
        <div className="flex whitespace-nowrap" style={{ animation:'ticker-scroll 35s linear infinite' }}>
          {[...marketData,...marketData,...marketData].map((item,i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-8 font-mono text-xs">
              <span className="text-slate-500 font-bold tracking-widest uppercase">{item.name}</span>
              <span className="text-white font-semibold">{item.price}</span>
              <span className={`inline-flex items-center font-bold ${item.isUp?'text-emerald-400':'text-rose-400'}`}>
                {item.isUp?<ArrowUpRight size={11}/>:<ArrowDownRight size={11}/>}{item.change}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── NAV ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-9 w-full z-[60] bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-black tracking-tight text-base text-slate-950">
            Siddharth Kusuma
            <span className="text-slate-500 font-medium text-sm hidden sm:inline"> / Financial Analyst</span>
          </span>
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(n => (
              <a key={n} href={`#${n.toLowerCase()}`}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeSection===n.toLowerCase() ? 'bg-emerald-950 text-white' : 'text-slate-700 hover:text-slate-950'
                }`}>{n}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href="https://www.linkedin.com/in/siddharth-kusuma/" target="_blank" rel="noreferrer"
               className="hidden sm:flex items-center gap-1.5 text-xs font-bold border border-slate-200 rounded-full px-4 py-2 hover:border-emerald-300 hover:text-emerald-800 transition-all text-slate-700">
              <Linkedin size={12}/> LinkedIn
            </a>
            <a href="/Siddharth_Kusuma_Resume.pdf" target="_blank" rel="noreferrer"
               className="flex items-center gap-1.5 text-xs font-bold bg-emerald-950 text-white rounded-full px-4 py-2 hover:bg-emerald-800 transition-all shadow-md shadow-emerald-950/20">
              <Download size={12}/> Resume
            </a>
            <button onClick={() => setMobileOpen(o=>!o)}
              className="lg:hidden p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Toggle menu">
              {mobileOpen ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
              className="lg:hidden border-t border-slate-100 bg-white overflow-hidden">
              <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
                {navLinks.map(n => (
                  <a key={n} href={`#${n.toLowerCase()}`} onClick={() => setMobileOpen(false)}
                     className="py-2.5 px-4 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors">
                    {n}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-[92px]">

        {/* ── HERO ───────────────────────────────────────────────────── */}
        <section className="relative min-h-[88vh] flex flex-col justify-center px-6 max-w-6xl mx-auto pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
            <div style={{
              backgroundImage:'linear-gradient(rgba(16,185,129,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.04) 1px,transparent 1px)',
              backgroundSize:'48px 48px', width:'100%', height:'100%',
            }}/>
          </div>

          <motion.h1
            initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
            transition={{duration:0.7, ease:[0.22,1,0.36,1], delay:0.15}}
            className="text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tighter leading-[0.95] mb-8"
          >
            <span className="block text-slate-950">Precision Modeling</span>
            <span className="block text-emerald-600 italic">Strategic Returns</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.6}}
            className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl font-medium mb-10">
            Analytical professional with a Master's in Engineering Management and 2+ years of experience
            in FP&A, 3-statement modeling, and quantitative risk assessment — bridging engineering-grade
            data modeling with corporate financial strategy to drive profitability.
          </motion.p>

          {/* ── MAGNETIC CTA BUTTONS ─────────────────────────────────── */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.45,duration:0.5}}
            className="flex flex-wrap gap-3">
            <MagneticBtn href="#contact"
              className="inline-flex items-center gap-2 bg-emerald-950 text-white font-bold text-sm rounded-full px-6 py-3 shadow-xl shadow-emerald-950/25">
              Get In Touch <ArrowUpRight size={14}/>
            </MagneticBtn>
            <MagneticBtn href="#experience"
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 font-bold text-sm rounded-full px-6 py-3 hover:border-slate-400">
              View Work <ChevronRight size={14}/>
            </MagneticBtn>
          </motion.div>

          {/* metrics */}
          <motion.div initial="hidden" animate="visible" variants={stagger}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map(({ value, label, icon: Icon }) => (
              <motion.div key={label} variants={fadeUp}
                className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-100 transition-colors">
                  <Icon size={15}/>
                </div>
                <p className="text-3xl font-black text-slate-950 tracking-tight">{value}</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── ABOUT ──────────────────────────────────────────────────── */}
        <section id="about" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-100">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:0.2}} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
            <motion.div variants={fadeLeft} className="md:col-span-5">
              <div className="relative">
                <div className="aspect-[4/5] bg-slate-100 rounded-[36px] overflow-hidden border border-slate-200 shadow-2xl">
                  <img src="/profile.jpg" alt="Siddharth Kusuma — Financial Analyst"
                       className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                       onError={e => { e.currentTarget.style.display='none'; }}/>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-emerald-950 text-white rounded-2xl px-4 py-3 shadow-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">GPA</p>
                  <p className="text-2xl font-black">3.60</p>
                  <p className="text-[10px] text-emerald-300">GWU · M.S. Eng. Mgmt</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="md:col-span-7">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-3">Mission Control</p>
              <h2 className="text-4xl font-black tracking-tight mb-8 text-slate-950 leading-tight">
                Engineering Mindset.<br/>Finance Precision.
              </h2>
              <div className="space-y-5 text-base text-slate-600 leading-relaxed">
                <p>I believe that a Balance Sheet is a dynamic ecosystem. My analytical edge is built on the conviction that financial strategy is only as strong as the structural integrity of the data behind it.</p>
                <p>Whether directing a <span className="text-slate-950 font-bold">$3.5M Series A modeling sprint</span> at Vosyn Inc. or managing downside exposure across <span className="text-slate-950 font-bold">50+ client portfolios (₹10 Cr / ~$1.2M AUM)</span> at Pravik Advisory, I treat market volatility as a variable to be managed — not feared.</p>
                <p>By synthesizing structural logic with financial economics, I deliver quantitative rigor that bridges complex data infrastructures with the long-term capital targets of the boardroom.</p>
              </div>

            </motion.div>
          </motion.div>
        </section>

        {/* ── EXPERIENCE — ANIMATED TIMELINE ─────────────────────────── */}
        <section id="experience" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-100">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:0.05}} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-14">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Career</p>
              <h2 className="text-4xl font-black tracking-tight text-slate-950">Professional Excellence</h2>
              <p className="text-slate-500 text-sm mt-2">Click any role to expand details</p>
            </motion.div>
          </motion.div>

          <div className="relative">
            {experience.map((job, i) => (
              <TimelineItem key={i} job={job} index={i} isLast={i === experience.length - 1}/>
            ))}
          </div>
        </section>

        {/* ── ACADEMIC PROJECTS ───────────────────────────────────────── */}
        <section id="projects" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-100">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:0.05}} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-14">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Academic Projects</p>
              <h2 className="text-4xl font-black tracking-tight text-slate-950">Strategic Initiatives</h2>
            </motion.div>

            <div className="space-y-8">
              {projects.map((proj, i) => (
                <motion.div key={i} variants={fadeUp}
                  className="bg-white border border-slate-200 rounded-[32px] p-8 md:p-10 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-7 pb-6 border-b border-slate-100">
                    <h3 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight">{proj.title}</h3>
                    <span className="font-mono text-xs font-bold shrink-0 px-3 py-1.5 rounded-full border border-slate-200 text-slate-500">{proj.period}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm leading-relaxed mb-6">
                    {proj.points.map((p, j) => (
                      <div key={j} className="text-slate-600">
                        <span className="font-bold text-slate-900">{p.label}: </span>{p.text}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {proj.tags.map(t => (
                      <span key={t} className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-[11px] rounded-full uppercase tracking-tight border border-slate-200">{t}</span>
                    ))}
                  </div>

                  {/* ── project file download buttons / placeholder ── */}
                  <ProjectFiles files={proj.files}/>

                  {/* ── live chart only on portfolio project ── */}
                  {i === 0 && <PortfolioChart/>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── SKILLS ─────────────────────────────────────────────────── */}
        <section id="skills" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-100">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:0.15}} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-14">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Capabilities</p>
              <h2 className="text-4xl font-black tracking-tight text-slate-950">Technical Arsenal</h2>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {skillGroups.map(({ title, icon: Icon, color, items }) => (
                <motion.div key={title} variants={fadeUp}
                  className={`rounded-[28px] p-8 border ${
                    color==='dark' ? 'bg-slate-950 border-slate-800'
                      : color==='emerald' ? 'bg-emerald-50 border-emerald-100'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div className="flex items-center gap-3 mb-7">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      color==='dark' ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-900 text-white'
                    }`}><Icon size={18}/></div>
                    <h4 className={`font-black uppercase tracking-widest text-xs font-mono ${
                      color==='dark' ? 'text-emerald-400' : 'text-slate-600'
                    }`}>{title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {items.map(s => (
                      <span key={s} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                        color==='dark' ? 'bg-white/5 border-white/10 text-slate-300'
                          : color==='emerald' ? 'bg-white border-emerald-200 text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}>{s}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── EDUCATION ──────────────────────────────────────────────── */}
        <section id="education" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-100">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:0.1}} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-14">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Credentials</p>
              <h2 className="text-4xl font-black tracking-tight text-slate-950">Academic Foundation</h2>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-5">
                <motion.div variants={fadeUp}
                  className="bg-white border border-slate-200 rounded-[28px] p-8 shadow-lg border-l-4 border-l-emerald-500">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-600 mb-4">Post-Graduate · Expected May 2026</p>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight">The George Washington University</h3>
                  <p className="text-slate-600 font-semibold mt-1">M.S. Engineering Management · Washington D.C.</p>
                  <p className="text-slate-500 text-sm mt-0.5">Focus — Economics, Finance & Cost Engineering</p>
                  <div className="mt-4 inline-flex items-center gap-2 bg-emerald-950 text-white rounded-xl px-4 py-2">
                    <Shield size={13} className="text-emerald-400"/>
                    <span className="font-black text-sm">GPA 3.60 / 4.00</span>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 border-t border-slate-100 pt-6 text-sm text-slate-700 font-medium">
                    {['Survey of Finance & Engineering Economics','MBAD Finance',
                      'Investment Engineering & Portfolio Management','Uncertainty in Cost Engineering'].map(c => (
                      <p key={c} className="flex items-start gap-2">
                        <ChevronRight size={13} className="text-emerald-500 shrink-0 mt-0.5"/>{c}
                      </p>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeUp}
                  className="bg-slate-50 border border-slate-200 rounded-[28px] p-8 border-l-4 border-l-slate-400">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 mb-4">Undergraduate · 2020 – 2024</p>
                  <h3 className="text-2xl font-black text-slate-950 tracking-tight">Mahindra University</h3>
                  <p className="text-slate-600 font-semibold mt-1">B.Tech — Mechanical Engineering · Hyderabad, India</p>
                  <p className="text-slate-500 text-sm mt-4 leading-relaxed italic">
                    Intensive study of systems architecture and analytical problem-solving — the structural backbone for high-dimensional financial modeling.
                  </p>
                </motion.div>
              </div>
              <motion.div variants={fadeUp} className="lg:col-span-5">
                <div className="bg-slate-950 rounded-[28px] p-8 h-full flex flex-col">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400 mb-8">Certifications</p>
                  <div className="space-y-6 flex-1">
                    {[
                      { org:'CFI', cert:'Financial Planning & Analysis (FP&A)' },
                      { org:'Wharton Online', cert:'Financial Accounting' },
                    ].map(({ org, cert }) => (
                      <div key={org} className="flex items-start gap-4 pb-6 border-b border-slate-800 last:border-0 last:pb-0">
                        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <BookOpen size={15} className="text-emerald-400"/>
                        </div>
                        <div>
                          <p className="text-white font-black text-base italic">{org}</p>
                          <p className="text-slate-400 text-xs font-semibold uppercase tracking-tight mt-0.5">{cert}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-2">Objective</p>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Bridging structural logic with advanced financial economics to build risk-resilient capital architectures and drive measurable profitability.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* ── CONTACT ────────────────────────────────────────────────── */}
        <section id="contact" className="py-24 px-6 max-w-6xl mx-auto border-t border-slate-100">
          <motion.div initial="hidden" whileInView="visible" viewport={{once:true,amount:0.2}} variants={stagger}>
            <motion.div variants={fadeUp}
              className="bg-slate-950 rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden style={{
                backgroundImage:'linear-gradient(rgba(16,185,129,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.2) 1px,transparent 1px)',
                backgroundSize:'40px 40px',
              }}/>
              <div className="relative">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-4">Let's Connect</p>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
                  Ready to Build<br/>
                  <span className="text-emerald-400 italic">Something Precise</span>
                </h2>
                <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed mb-10">
                  Whether you're looking for a Financial Analyst, FP&A lead, or capital markets modeler — let's talk.
                  I'm open to full-time roles and high-impact opportunities.
                </p>

                {/* ── MAGNETIC CONTACT BUTTONS ───────────────────────── */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <MagneticBtn href="mailto:siddharthkusuma2002@gmail.com"
                    className="inline-flex items-center gap-2 bg-emerald-500 text-white font-black text-sm rounded-full px-8 py-4 shadow-xl shadow-emerald-900/50">
                    <Mail size={15}/> Email Me
                  </MagneticBtn>
                  <MagneticBtn href="https://www.linkedin.com/in/siddharth-kusuma/" 
                    className="inline-flex items-center gap-2 border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-white font-bold text-sm rounded-full px-8 py-4">
                    <Linkedin size={15}/> LinkedIn
                  </MagneticBtn>
                  <MagneticBtn href="/Siddharth_Kusuma_Resume.pdf"
                    className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold text-sm rounded-full px-8 py-4">
                    <Download size={15}/> Resume PDF
                  </MagneticBtn>
                </div>

                {/* CHANGE 4 — phone removed, email-only contact */}
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <span>Washington D.C. Metro Area</span>
                  <span className="text-slate-700">·</span>
                  <span>siddharthkusuma2002@gmail.com</span>
                  <span className="text-slate-700">·</span>
                  <span>Open to Relocate</span>
                  <span className="text-slate-700">·</span>
                  <span>Available Immediately</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

      </main>

      <footer className="py-8 px-6 border-t border-slate-100 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-300">
          © 2026 Siddharth Kusuma · Engineered for Strategic ROI
        </p>
      </footer>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        html { scroll-behavior: smooth; }
        ::selection { background: #d1fae5; }
      `}</style>
    </div>
  );
}
