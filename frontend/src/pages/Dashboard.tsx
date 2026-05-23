import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  ShieldAlert, 
  AlertOctagon, 
  Zap, 
  Cpu, 
  TrendingUp, 
  CheckCircle,
  FileCode,
  Binary,
  Fingerprint
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar 
} from 'recharts';


const Dashboard: React.FC = () => {
  const { documents, logs } = useApp();

  // Metrics Calculation
  const totalProcessed = documents.length;
  const fraudCases = documents.filter(doc => doc.riskLevel === 'High' && doc.status === 'Completed').length;
  const highRiskAlerts = documents.filter(doc => doc.fraudScore >= 80).length;
  
  const avgConfidence = useMemo(() => {
    const completed = documents.filter(doc => doc.status === 'Completed');
    if (completed.length === 0) return 0;
    const sum = completed.reduce((acc, doc) => acc + (100 - Math.abs(doc.fraudScore - 50) * 0.5), 0); // Simulated confidence
    return Math.round(sum / completed.length);
  }, [documents]);

  const speedMetric = documents.some(doc => doc.status === 'Processing') ? '1.8s' : '2.4s';

  // Chart Data: Fraud Trend over past mock dates
  const trendData = [
    { date: 'May 17', score: 14 },
    { date: 'May 18', score: 32 },
    { date: 'May 19', score: 28 },
    { date: 'May 20', score: 45 },
    { date: 'May 21', score: 12 },
    { date: 'May 22', score: 84 },
    { date: 'May 23', score: 62 },
  ];

  // Risk Distribution Data
  const riskDistribution = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    documents.forEach(doc => {
      if (doc.status === 'Completed') {
        counts[doc.riskLevel]++;
      }
    });
    return [
      { name: 'High Risk', value: counts.High, color: '#ef4444' },
      { name: 'Medium Risk', value: counts.Medium, color: '#f59e0b' },
      { name: 'Low Risk', value: counts.Low, color: '#10b981' }
    ];
  }, [documents]);

  // Document Categories
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    documents.forEach(doc => {
      counts[doc.type] = (counts[doc.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [documents]);

  // Network Load Simulation
  const loadData = [
    { time: '09:00', load: 35 },
    { time: '09:05', load: 45 },
    { time: '09:10', load: 60 },
    { time: '09:15', load: 85 },
    { time: '09:20', load: 50 },
    { time: '09:25', load: 40 },
    { time: '09:30', load: 70 },
  ];

  // Active agents status listing
  const activeAgents = [
    { name: 'Orchestrator Agent', status: 'Idle', load: '0%', latency: '4ms', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { name: 'CV Fraud Lens', status: 'Monitoring', load: '14%', latency: '240ms', color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'OCR Alignment', status: 'Idle', load: '0%', latency: '90ms', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Signature Profiler', status: 'Running', load: '45%', latency: '450ms', color: 'text-emerald-600', bg: 'bg-emerald-50', pulse: true },
    { name: 'RAG Knowledge Agent', status: 'Idle', load: '0%', latency: '35ms', color: 'text-sky-600', bg: 'bg-sky-50' },
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Title block with live indicators */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Security Control Dashboard</h1>
          <p className="text-xs text-slate-500">Real-time AI document verification, signature diagnostics, and mathematical consistency checks.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/60 rounded-xl shadow-xs text-xs font-bold text-slate-700">
            <Cpu className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            Agent Engine: Active
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI: Total Processed */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/50 shadow-xs flex flex-col justify-between hover:border-slate-350 transition-colors min-h-[90px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Processed Files</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{totalProcessed}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">documents</span>
          </div>
        </div>

        {/* KPI: Fraud Detected */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/50 shadow-xs flex flex-col justify-between hover:border-slate-350 transition-colors min-h-[90px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase font-bold text-slate-455 tracking-wider">High Risk Cases</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-red-600 tracking-tight">{fraudCases}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">flagged</span>
          </div>
        </div>

        {/* KPI: High Risk Alerts */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/50 shadow-xs flex flex-col justify-between hover:border-slate-350 transition-colors min-h-[90px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase font-bold text-slate-450 tracking-wider">Anomalies Detected</span>
            <AlertOctagon className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{highRiskAlerts}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">alerts</span>
          </div>
        </div>

        {/* KPI: AI Confidence */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/50 shadow-xs flex flex-col justify-between hover:border-slate-350 transition-colors min-h-[90px]">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Confidence Mean</span>
            <Cpu className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{avgConfidence}%</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">confidence</span>
          </div>
        </div>

        {/* KPI: Processing Speed */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/50 shadow-xs flex flex-col justify-between hover:border-slate-350 transition-colors min-h-[90px] col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Verification Latency</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{speedMetric}</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">latency</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fraud Trends Graph */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Fraud Incidents Trend</h3>
              <p className="text-[10px] text-slate-400">Weekly tracking of average document fraud scores</p>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
              <TrendingUp className="w-3 h-3" />
              +14% this week
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', border: 'none', borderRadius: 8, color: '#f8fafc', fontSize: 10 }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: 2 }}
                />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Risk Distribution</h3>
            <p className="text-[10px] text-slate-400">Classification of reviewed document integrity</p>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Summary Label */}
            <div className="absolute text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Analyzed</span>
              <div className="text-2xl font-black text-slate-800">{documents.length}</div>
            </div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold pt-2">
            {riskDistribution.map((r, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="w-2.5 h-2.5 rounded-full mb-1" style={{ backgroundColor: r.color }} />
                <span className="text-slate-700">{r.name}</span>
                <span className="text-slate-400">{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub Grids: Analytics & Log Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Categories (Bar Chart) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Format Breakdown</h3>
            <p className="text-[10px] text-slate-400">Processed file counts by format extension</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} barSize={16}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Load (Area Chart) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Node Processing Pipeline</h3>
            <p className="text-[10px] text-slate-400">Vertex AI agent request frequency loads</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loadData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 9, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ fontSize: 10 }} />
                <Area type="monotone" dataKey="load" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Activity Status & Live Logs Feed */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs flex flex-col h-[320px]">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Agent Heartbeat Monitor</h3>
              <p className="text-[10px] text-slate-400">Vertex AI multi-agent daemon cluster</p>
            </div>
            <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">All OK</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 scrollbar-thin">
            {activeAgents.map((agent, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${agent.bg} ${agent.color}`}>
                    {agent.name.includes('Orchestrator') ? <Cpu className="w-3.5 h-3.5" /> : 
                     agent.name.includes('CV') ? <FileCode className="w-3.5 h-3.5" /> :
                     agent.name.includes('OCR') ? <Binary className="w-3.5 h-3.5" /> :
                     agent.name.includes('Signature') ? <Fingerprint className="w-3.5 h-3.5" /> :
                     <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">{agent.name}</h4>
                    <span className="text-[9px] text-slate-400">Latency: {agent.latency}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    {agent.pulse && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
                    <span className={`text-[10px] font-bold ${
                      agent.status === 'Running' ? 'text-emerald-600 font-extrabold' : 
                      agent.status === 'Monitoring' ? 'text-indigo-600' : 'text-slate-400'
                    }`}>{agent.status}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">Load: {agent.load}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Operations Log Feed */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/60 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Live Analysis Stream</h3>
            <p className="text-[10px] text-slate-400">Real-time logs from agent tasks, neural consensus, and database lookups</p>
          </div>
          <span className="text-[9px] font-bold text-slate-400">Showing last 4 logs</span>
        </div>

        <div className="space-y-2">
          {logs.slice(0, 4).map((log) => (
            <div key={log.id} className="flex gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
              <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                  log.category === 'System' ? 'bg-slate-100 text-slate-600' :
                  log.category === 'AI Agent' ? 'bg-indigo-50 text-indigo-600' :
                  'bg-sky-50 text-sky-600'
                }`}>
                  {log.category}
                </span>
                <span className={`text-[10px] font-bold ${
                  log.severity === 'error' ? 'text-red-500' :
                  log.severity === 'warning' ? 'text-amber-500' :
                  'text-slate-600'
                }`}>
                  [{log.agent}]
                </span>
              </div>
              <p className="text-xs text-slate-600 flex-1 min-w-0 truncate">
                {log.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
