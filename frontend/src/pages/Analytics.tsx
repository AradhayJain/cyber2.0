import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Zap, 
  ShieldCheck, 
  AlertTriangle,
  Download,
  Calendar,
  Sparkles
} from 'lucide-react';

const Analytics: React.FC = () => {
  // Mock Data: Monthly fraud statistics
  const monthlyData = [
    { name: 'Jan', processed: 4200, clean: 4100, fraud: 100 },
    { name: 'Feb', processed: 4800, clean: 4680, fraud: 120 },
    { name: 'Mar', processed: 5100, clean: 4940, fraud: 160 },
    { name: 'Apr', processed: 6200, clean: 6010, fraud: 190 },
    { name: 'May', processed: 7400, clean: 7150, fraud: 250 },
  ];

  // Mock Data: Latency performance of nodes over 7 days
  const latencyData = [
    { name: 'Mon', ocr: 110, cv: 270, signature: 410 },
    { name: 'Tue', ocr: 120, cv: 250, signature: 390 },
    { name: 'Wed', ocr: 90, cv: 280, signature: 450 },
    { name: 'Thu', ocr: 115, cv: 240, signature: 420 },
    { name: 'Fri', ocr: 100, cv: 230, signature: 380 },
    { name: 'Sat', ocr: 95, cv: 210, signature: 370 },
    { name: 'Sun', ocr: 105, cv: 220, signature: 400 },
  ];

  // Mock Data: Sub-agent performance (anomalies flagged)
  const agentPerformance = [
    { name: 'CV Forensics', alerts: 142, color: '#6366f1' },
    { name: 'Signature Verifier', alerts: 88, color: '#a855f7' },
    { name: 'NLP Math Agent', alerts: 65, color: '#0ea5e9' },
    { name: 'Metadata Checker', alerts: 110, color: '#f59e0b' },
    { name: 'RAG Reference Check', alerts: 34, color: '#10b981' }
  ];

  // Mock Data: Risk Score probability distribution clusters
  const confidenceDistribution = [
    { score: '0-10', count: 1240 },
    { score: '11-20', count: 980 },
    { score: '21-30', count: 420 },
    { score: '31-40', count: 180 },
    { score: '41-50', count: 90 },
    { score: '51-60', count: 110 },
    { score: '61-70', count: 140 },
    { score: '71-80', count: 280 },
    { score: '81-90', count: 650 },
    { score: '91-100', count: 910 },
  ];

  const overallMetrics = [
    { title: 'Ingested Documents', value: '27,700', change: '+18% MoM', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'True Fraud Intercepts', value: '820', change: '+24% MoM', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { title: 'Avg Detection Speed', value: '310ms', change: '-45ms reduction', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Enterprise Analytics Console</h1>
          <p className="text-xs text-slate-500">Aggregate statistics of fraud clusters, sub-agent latency trends, and true-positive intercept values.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200/60 text-xs font-bold text-slate-700 rounded-xl hover:shadow-xs transition-all cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Export Compliance Audit PDF
          </button>
        </div>
      </div>

      {/* KPI stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {overallMetrics.map((item, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.title}</span>
              <div className="text-2xl font-black text-slate-800">{item.value}</div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{item.change}</span>
            </div>
            <div className={`p-3.5 rounded-2xl ${item.bg} ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Monthly processed vs fraud */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Volume & Intercept Stream</h3>
              <p className="text-[10px] text-slate-400">Monthly breakdown of analyzed vs flagged documentation</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Intercepts +24% MoM
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ left: -15, right: 10 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Bar dataKey="clean" stackId="a" fill="#818cf8" radius={[0, 0, 0, 0]} name="Clean Documents" />
                <Bar dataKey="fraud" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Fraud Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Agent Performance Trigger rates */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Sub-Agent Trigger Rates</h3>
              <p className="text-[10px] text-slate-400">Anomalies successfully isolated by specific forensic tools</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformance} layout="vertical" margin={{ left: 30, right: 10 }}>
                <XAxis type="number" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#64748b', fontWeight: 'bold' }} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Bar dataKey="alerts" fill="#6366f1" radius={[0, 4, 4, 0]}>
                  {agentPerformance.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Processing Latency of Nodes */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Sub-Agent Latency Trends</h3>
              <p className="text-[10px] text-slate-400">Daily verification processing time benchmarks in ms</p>
            </div>
            <div className="flex items-center gap-3 text-[9px] font-bold">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" />OCR</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" />CV</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-500" />Signature</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData} margin={{ left: -15, right: 10 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="ocr" stroke="#6366f1" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="cv" stroke="#a855f7" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="signature" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Confidence Distribution (Probability Clusters) */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Risk Score Density</h3>
              <p className="text-[10px] text-slate-400">Distribution frequency showing model output clusters</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={confidenceDistribution} margin={{ left: -15, right: 10 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="score" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" name="Document Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
