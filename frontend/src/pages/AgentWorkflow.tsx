import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Binary, 
  FileText, 
  Fingerprint, 
  Search, 
  Database, 
  Scale, 
  Compass, 
  CheckSquare, 
  Play, 
  Database as MemoryIcon,
  FileDown
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AgentNode {
  id: string;
  name: string;
  type: 'orchestrator' | 'tool' | 'memory' | 'reasoning' | 'output';
  icon: React.ComponentType<any>;
  status: 'idle' | 'running' | 'completed' | 'failed';
  latency: string;
  confidence: string;
  tasks: string[];
  logs: string[];
  column: number;
}

const AgentWorkflow: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('orchestrator');
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState(false);

  // Predefined Agent Nodes
  const [nodes, setNodes] = useState<AgentNode[]>([
    {
      id: 'upload',
      name: 'Document Ingestion',
      type: 'orchestrator',
      icon: FileDown,
      status: 'completed',
      latency: '10ms',
      confidence: '100%',
      tasks: ['Read uploaded binary buffer', 'Verify checksum validation', 'Detect document mimetype'],
      logs: [
        'Buffer stream received from local client upload.',
        'File hash evaluated: SHA-256 (3a1b5c82...).',
        'Ingestion confirmed. Routing to Orchestrator Agent.'
      ],
      column: 1
    },
    {
      id: 'orchestrator',
      name: 'Orchestrator Agent',
      type: 'orchestrator',
      icon: Cpu,
      status: 'idle',
      latency: '24ms',
      confidence: '99.8%',
      tasks: ['Analyze document structure', 'Select appropriate forensic tools', 'Dispatch parallel analysis'],
      logs: [
        'Orchestrating parallel workloads...',
        'Spawning CV Analysis, Metadata Analysis, Signature Scanner, and OCR Extractors.',
        'Awaiting sub-agent evaluations for Shared Memory consolidation.'
      ],
      column: 2
    },
    {
      id: 'ocr',
      name: 'OCR Extract Tool',
      type: 'tool',
      icon: Binary,
      status: 'idle',
      latency: '120ms',
      confidence: '98.5%',
      tasks: ['Extract structural character blocks', 'Verify font metrics alignment', 'Reconstruct document layout'],
      logs: [
        'Running Vertex Document OCR OCR-B sub-engine.',
        'Font matching analysis initiated.',
        'OCR completed: 1,420 tokens extracted.'
      ],
      column: 3
    },
    {
      id: 'metadata',
      name: 'Metadata Forensic Tool',
      type: 'tool',
      icon: FileText,
      status: 'idle',
      latency: '34ms',
      confidence: '100%',
      tasks: ['Extract EXIF metadata tags', 'Verify file creation timestamp alignment', 'Cross-check modification authors'],
      logs: [
        'Inspecting PDF binary tags.',
        'Flagged: Creation timestamp and system timestamp differ by 10 days.',
        'Software tag detected: Adobe Acrobat vs GIMP override.'
      ],
      column: 3
    },
    {
      id: 'cv_fraud',
      name: 'CV Forensics Tool',
      type: 'tool',
      icon: Search,
      status: 'idle',
      latency: '280ms',
      confidence: '95%',
      tasks: ['Locate local compression anomalies', 'Verify photo overlay boundaries', 'Scan alignment consistency'],
      logs: [
        'Segmenting document page into 8 sub-grids.',
        'Applying texture gradient vector matches.',
        'Flagged visual overlap around bounding box coordinates [480, 240, 220, 30].'
      ],
      column: 3
    },
    {
      id: 'signature',
      name: 'Signature Verifier',
      type: 'tool',
      icon: Fingerprint,
      status: 'idle',
      latency: '450ms',
      confidence: '92.4%',
      tasks: ['Isolate signature coordinates', 'Match vector curves against reference database', 'Calculate trace/autopen confidence'],
      logs: [
        'Signature bounding box cropped and isolated.',
        'Running vector-gradient cross-matching.',
        'Alert: Signature velocity profile shows autopen trace replication pattern.'
      ],
      column: 3
    },
    {
      id: 'shared_memory',
      name: 'Shared Context Memory',
      type: 'memory',
      icon: MemoryIcon,
      status: 'idle',
      latency: '5ms',
      confidence: '100%',
      tasks: ['Store temporary sub-agent logs', 'Resolve contradictory agent outcomes', 'Provide context database interface'],
      logs: [
        'Context database loaded: 14 keys persisted.',
        'Sub-agent logs merged. Ready for reasoning review.',
        'Shared memory broadcast: Alert status active.'
      ],
      column: 4
    },
    {
      id: 'nlp_reasoning',
      name: 'NLP Logic Agent',
      type: 'reasoning',
      icon: Scale,
      status: 'idle',
      latency: '320ms',
      confidence: '97.2%',
      tasks: ['Verify mathematical calculations', 'Validate entity data points', 'Crosscheck transaction values'],
      logs: [
        'Analyzing OCR text numbers.',
        'Mismatch detected: Qty 1 x Price $15,000 computed as $75,000.',
        'Semantic report generated: Inconsistent totals found.'
      ],
      column: 5
    },
    {
      id: 'rag_knowledge',
      name: 'RAG Knowledge Agent',
      type: 'reasoning',
      icon: Database,
      status: 'idle',
      latency: '85ms',
      confidence: '94.8%',
      tasks: ['Query historical fraud repository', 'Compare metadata against blacklisted hashes', 'Retrieve signature templates'],
      logs: [
        'Querying ChromaDB vector database.',
        'No matching document hashes found.',
        'Retrieved Signature template matches: Marcus Vance reference signature v1.2.'
      ],
      column: 5
    },
    {
      id: 'risk_scoring',
      name: 'Risk Scoring Agent',
      type: 'output',
      icon: Cpu,
      status: 'idle',
      latency: '15ms',
      confidence: '99%',
      tasks: ['Compile individual risk scores', 'Compute weighted risk average', 'Classify final risk level'],
      logs: [
        'Averages calculated: CV (88%), Signature (66%), Math (95%).',
        'Consensus reached: High Risk Classification.',
        'Assigned final score: 84/100.'
      ],
      column: 6
    },
    {
      id: 'explainability',
      name: 'Explainability Agent',
      type: 'output',
      icon: Compass,
      status: 'idle',
      latency: '110ms',
      confidence: '98%',
      tasks: ['Synthesize Gemini reasoning logs', 'Construct forensic timeline', 'Generate natural explanation'],
      logs: [
        'Translating mathematical inconsistencies to plain-text explanation.',
        'Formatting metadata warning notes.',
        'Final explanation report generated.'
      ],
      column: 6
    }
  ]);

  // Simulation Sequence Effect
  useEffect(() => {
    if (!isSimulating) return;

    // Simulation steps mapping to column indexes
    const stepDuration = 1500;
    
    if (activeStep === 0) {
      // Ingestion and Orchestrator active
      setNodes(prev => prev.map(n => 
        n.column === 1 ? { ...n, status: 'completed' } :
        n.column === 2 ? { ...n, status: 'running' } : { ...n, status: 'idle' }
      ));
      setSelectedNodeId('orchestrator');
    } else if (activeStep === 1) {
      // Parallel tools active
      setNodes(prev => prev.map(n => 
        n.column === 2 ? { ...n, status: 'completed' } :
        n.column === 3 ? { ...n, status: 'running' } : n
      ));
      setSelectedNodeId('cv_fraud');
    } else if (activeStep === 2) {
      // Shared memory active
      setNodes(prev => prev.map(n => 
        n.column === 3 ? { ...n, status: 'completed' } :
        n.column === 4 ? { ...n, status: 'running' } : n
      ));
      setSelectedNodeId('shared_memory');
    } else if (activeStep === 3) {
      // Reasoning agents active
      setNodes(prev => prev.map(n => 
        n.column === 4 ? { ...n, status: 'completed' } :
        n.column === 5 ? { ...n, status: 'running' } : n
      ));
      setSelectedNodeId('nlp_reasoning');
    } else if (activeStep === 4) {
      // Risk scoring active
      setNodes(prev => prev.map(n => 
        n.column === 5 ? { ...n, status: 'completed' } :
        n.column === 6 ? { ...n, status: 'running' } : n
      ));
      setSelectedNodeId('risk_scoring');
    } else if (activeStep === 5) {
      // All completed
      setNodes(prev => prev.map(n => ({ ...n, status: 'completed' })));
      setSelectedNodeId('explainability');
      setIsSimulating(false);
      setActiveStep(-1);
      return;
    }

    const timer = setTimeout(() => {
      setActiveStep(prev => prev + 1);
    }, stepDuration);

    return () => clearTimeout(timer);
  }, [activeStep, isSimulating]);

  const startSimulation = () => {
    setIsSimulating(true);
    setActiveStep(0);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Group nodes by column for layout rendering
  const columns = [1, 2, 3, 4, 5, 6];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Agent Orchestration Swarm</h1>
          <p className="text-xs text-slate-500">Visualize decision paths, shared session memory, and parallel sub-agent reasoning loops.</p>
        </div>
        <button
          onClick={startSimulation}
          disabled={isSimulating}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          {isSimulating ? 'Processing Document...' : 'Run Swarm Simulation'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
        {/* Node Workflow Map */}
        <div className="xl:col-span-3 glass-card rounded-3xl p-6 relative overflow-x-auto min-h-[500px] flex items-center justify-between gap-6 scrollbar-thin">
          
          {/* SVG Connection Lines Overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0">
            {/* Draw flowing dashed paths connecting stages */}
            {/* Stage 1 to 2 */}
            <path d="M 120 250 Q 180 250 240 250" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="5,5" className={isSimulating ? 'animate-flow' : ''} />
            {/* Stage 2 to Stage 3 (Parallel splitter) */}
            <path d="M 360 250 Q 400 250 440 100" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5,5" />
            <path d="M 360 250 Q 400 250 440 200" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5,5" />
            <path d="M 360 250 Q 400 250 440 300" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5,5" />
            <path d="M 360 250 Q 400 250 440 400" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="5,5" />
            
            {/* Stage 3 to Stage 4 (Consolidation into memory) */}
            <path d="M 560 100 Q 600 250 640 250" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            <path d="M 560 200 Q 600 250 640 250" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            <path d="M 560 300 Q 600 250 640 250" fill="none" stroke="#a855f7" strokeWidth="1.5" />
            <path d="M 560 400 Q 600 250 640 250" fill="none" stroke="#a855f7" strokeWidth="1.5" />

            {/* Stage 4 to Stage 5 */}
            <path d="M 760 250 Q 800 250 840 150" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="5,5" />
            <path d="M 760 250 Q 800 250 840 350" fill="none" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="5,5" />

            {/* Stage 5 to Stage 6 */}
            <path d="M 960 150 Q 1000 250 1040 200" fill="none" stroke="#10b981" strokeWidth="1.5" />
            <path d="M 960 350 Q 1000 250 1040 300" fill="none" stroke="#10b981" strokeWidth="1.5" />
          </svg>

          {/* Columns of Nodes */}
          {columns.map((colIndex) => {
            const colNodes = nodes.filter(n => n.column === colIndex);
            
            let stageLabel = '';
            if (colIndex === 1) stageLabel = 'Ingest';
            else if (colIndex === 2) stageLabel = 'Control';
            else if (colIndex === 3) stageLabel = 'Parallel Analysis';
            else if (colIndex === 4) stageLabel = 'State';
            else if (colIndex === 5) stageLabel = 'Reasoning';
            else if (colIndex === 6) stageLabel = 'Decision';

            return (
              <div key={colIndex} className="flex flex-col gap-6 items-center z-10 shrink-0 w-44">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest mb-2 border-b border-slate-100 pb-1 w-full text-center">
                  {stageLabel}
                </span>
                
                <div className="flex flex-col gap-6 justify-center flex-1 w-full">
                  {colNodes.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    const Icon = node.icon;
                    
                    return (
                      <motion.div
                        key={node.id}
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center gap-1.5 shadow-sm relative group bg-white ${
                          isSelected 
                            ? 'border-indigo-600 shadow-md ring-2 ring-indigo-50' 
                            : 'border-slate-200/80 hover:border-slate-300'
                        } ${
                          node.status === 'running' ? 'animate-pulse-glow border-indigo-500' : ''
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        {/* Agent Connection Indicator Ring */}
                        {node.status === 'completed' && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                        )}
                        {node.status === 'running' && (
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                        )}

                        <div className={`p-2.5 rounded-xl ${
                          node.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                          node.status === 'running' ? 'bg-indigo-50 text-indigo-600' :
                          'bg-slate-50 text-slate-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-800 leading-tight">
                            {node.name}
                          </h4>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {node.status === 'idle' ? 'Awaiting Data' : 
                             node.status === 'running' ? 'Processing...' : 
                             node.latency}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Node Details Panel */}
        <div className="xl:col-span-1 p-5 rounded-3xl bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-xs flex flex-col h-[500px]">
          <div className="flex items-start justify-between border-b border-slate-200/50 pb-4 mb-4">
            <div>
              <span className="text-[9px] font-extrabold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">
                {selectedNode.type}
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 mt-1">{selectedNode.name}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-700">{selectedNode.latency}</span>
              <p className="text-[9px] text-slate-400">Confidence: {selectedNode.confidence}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 scrollbar-thin">
            {/* Agent Tasks */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
                Assigned Execution Steps
              </h4>
              <ul className="space-y-1.5">
                {selectedNode.tasks.map((task, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2 leading-tight">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Agent Prompt Logs (forensics shell style) */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                Prompt & Output Stream
              </h4>
              <div className="p-3 bg-slate-950 text-slate-200 rounded-2xl font-mono text-[10px] leading-relaxed space-y-1.5 overflow-x-auto">
                {selectedNode.logs.map((log, i) => (
                  <p key={i} className={log.includes('Flagged') || log.includes('Alert') ? 'text-red-400' : 'text-slate-300'}>
                    <span className="text-indigo-400">&gt;</span> {log}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentWorkflow;
