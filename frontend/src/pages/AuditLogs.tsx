import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { AuditLog } from '../context/AppContext';
import { 
  Search, 
  Terminal, 
  AlertTriangle, 
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuditLogs: React.FC = () => {
  const { logs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Filters calculation
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = 
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.agent.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || log.category === selectedCategory;
      const matchesSeverity = selectedSeverity === 'All' || log.severity === selectedSeverity;
      
      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [logs, searchQuery, selectedCategory, selectedSeverity]);

  const toggleExpandLog = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  // Mock raw JSON payload metadata generator
  const getLogPayload = (log: AuditLog) => {
    return JSON.stringify({
      event_id: log.id,
      timestamp: log.timestamp,
      actor: {
        type: log.category,
        name: log.agent,
        connection_ip: '10.220.14.88'
      },
      audit_event: {
        descriptor: log.message,
        compliance_flag: log.severity === 'error' ? 'FAILED' : 'SUCCESS',
        severity_weight: log.severity === 'error' ? 0.92 : log.severity === 'warning' ? 0.45 : 0.05
      },
      vertex_model_metadata: {
        model_version: 'gemini-1.5-pro-002',
        orchestration_token: 'tok_' + Math.random().toString(36).substring(7),
        consensus_achieved: true
      }
    }, null, 2);
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cyber-Forensics Audit Console</h1>
        <p className="text-xs text-slate-500">Security Operations Center (SOC) system logs, multi-agent reasoning traces, and database access logs.</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/60 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs by agent or message..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800 placeholder:text-slate-400 font-semibold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 text-[10px] bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              <option value="System">System</option>
              <option value="AI Agent">AI Agent</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-2.5 py-1.5 text-[10px] bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Severities</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main SOC Logs Listing */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs flex flex-col min-h-[400px]">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5 mb-4">
          <Terminal className="w-4 h-4 text-indigo-500" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Terminal Trace logs</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin max-h-[500px]">
          {filteredLogs.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-xs">
              No audit logs match current filters.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              
              return (
                <div key={log.id} className="border border-slate-100 rounded-2xl overflow-hidden hover:border-slate-200 transition-colors bg-white">
                  <div 
                    onClick={() => toggleExpandLog(log.id)}
                    className="p-3.5 flex items-start gap-4 justify-between cursor-pointer select-none text-xs hover:bg-slate-50/40"
                  >
                    {/* Timestamp & Type Indicator */}
                    <div className="flex items-start gap-4">
                      <span className="text-[10px] font-mono text-slate-400 mt-1 shrink-0">
                        {new Date(log.timestamp).toISOString()}
                      </span>
                      
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm shrink-0 ${
                          log.category === 'System' ? 'bg-slate-100 text-slate-600' :
                          log.category === 'AI Agent' ? 'bg-indigo-50 text-indigo-600' :
                          'bg-sky-50 text-sky-600'
                        }`}>
                          {log.category === 'AI Agent' ? 'AGENT' : log.category}
                        </span>
                        
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.2 rounded-full shrink-0 ${
                          log.severity === 'error' ? 'bg-red-50 text-red-600' :
                          log.severity === 'warning' ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {log.severity === 'error' ? <AlertTriangle className="w-2.5 h-2.5" /> :
                           log.severity === 'warning' ? <AlertTriangle className="w-2.5 h-2.5" /> :
                           <CheckCircle className="w-2.5 h-2.5" />}
                          {log.severity}
                        </span>
                      </div>

                      {/* Log Message summary */}
                      <div className="min-w-0">
                        <span className="font-bold text-slate-700 mr-2 font-mono">[{log.agent}]</span>
                        <span className="text-slate-600 leading-snug">{log.message}</span>
                      </div>
                    </div>

                    <button className="text-slate-400 p-1 hover:text-slate-600 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expandable JSON Trace payload */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 border-t border-slate-100 bg-slate-950 text-slate-300 font-mono text-[10px] leading-relaxed relative">
                          <span className="absolute top-2 right-4 text-[8px] font-bold text-slate-500 uppercase tracking-widest">RAW SOC SCHEMAS</span>
                          <pre className="overflow-x-auto">{getLogPayload(log)}</pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
