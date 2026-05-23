import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sliders, 
  Cpu, 
  Key, 
  Check, 
  RefreshCw,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';

const Settings: React.FC = () => {
  const { settings, updateSettings, addLog } = useApp();

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ aiModel: e.target.value });
    addLog({
      category: 'User',
      agent: 'Security Admin',
      message: `Vertex AI base model updated to ${e.target.value}`,
      severity: 'info'
    });
  };

  const handleSliderChange = (key: 'cvThreshold' | 'nlpThreshold', value: number) => {
    updateSettings({ [key]: value });
  };

  const handleAgentToggle = (agentName: string) => {
    const active = [...settings.activeAgents];
    const index = active.indexOf(agentName);
    if (index > -1) {
      if (active.length > 2) { // Keep at least 2 agents
        active.splice(index, 1);
      }
    } else {
      active.push(agentName);
    }
    updateSettings({ activeAgents: active });
    addLog({
      category: 'User',
      agent: 'Security Admin',
      message: `Agent swarm cluster composition updated. Active nodes: ${active.length}`,
      severity: 'info'
    });
  };

  const handleToggleAutoApprove = () => {
    const newVal = !settings.autoApprove;
    updateSettings({ autoApprove: newVal });
    addLog({
      category: 'User',
      agent: 'Security Admin',
      message: `Auto-approve clean documents toggled to ${newVal ? 'ENABLED' : 'DISABLED'}`,
      severity: 'warning'
    });
  };

  const allAvailableAgents = [
    'Orchestrator',
    'OCR Extract',
    'CV Forensics',
    'Signature Verifier',
    'NLP Logic',
    'RAG Knowledge',
    'Risk Scoring',
    'Explainability'
  ];

  return (
    <div className="space-y-8 p-6 lg:p-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Settings</h1>
        <p className="text-xs text-slate-500">Configure Vertex AI models, manage parallel agent structures, tune risk thresholds, and manage API keys.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Panel 1: Vertex AI Configuration */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Cpu className="w-4.5 h-4.5 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Vertex AI Core Engine</h3>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 font-bold">LLM Decision & Explainability Model</label>
              <select
                value={settings.aiModel}
                onChange={handleModelChange}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-hidden"
              >
                <option value="Gemini 1.5 Pro (Vertex AI)">Gemini 1.5 Pro (Vertex AI)</option>
                <option value="Gemini 1.5 Flash (Vertex AI)">Gemini 1.5 Flash (Vertex AI)</option>
                <option value="Gemini 1.0 Ultra (Vertex AI)">Gemini 1.0 Ultra (Vertex AI)</option>
                <option value="Fine-tuned SecOps-Llama (Local Nodes)">Fine-tuned SecOps-Llama (Local Nodes)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 font-bold">Google Cloud Project ID</label>
                <input
                  type="text"
                  placeholder="e.g. project-fraudshield-secops"
                  defaultValue="project-fraudshield-secops"
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-500 font-bold">Vertex Endpoint Region</label>
                <input
                  type="text"
                  placeholder="e.g. us-central1"
                  defaultValue="us-central1"
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-2 text-indigo-700">
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-normal font-semibold">
                Using Vertex AI application-default credentials (ADC) configured in the local container host. Services operate under default project parameters.
              </p>
            </div>
          </div>
        </div>

        {/* Panel 2: Agent Swarm Tuning */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <SlidersHorizontal className="w-4.5 h-4.5 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Agent Swarm Tuning</h3>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] text-slate-500 font-bold">SELECT ACTIVE AGENT NODES TO ENLIST IN FORENSIC DEBATES:</p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {allAvailableAgents.map((agentName) => {
                const isActive = settings.activeAgents.includes(agentName);
                
                return (
                  <button
                    key={agentName}
                    onClick={() => handleAgentToggle(agentName)}
                    className={`flex items-center justify-between p-3 border rounded-2xl transition-all cursor-pointer font-bold text-left ${
                      isActive 
                        ? 'border-indigo-500 bg-indigo-50/20 text-indigo-700 shadow-xs' 
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-400'
                    }`}
                  >
                    <span>{agentName}</span>
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center border text-white ${
                      isActive ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                    }`}>
                      {isActive && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel 3: Risk Threshold Sliders */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4.5 h-4.5 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Risk Threshold Modifiers</h3>
          </div>

          <div className="space-y-6 text-xs font-semibold">
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Computer Vision Forensics Weight ({settings.cvThreshold}%)</span>
                <span className="text-indigo-600">{settings.cvThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.cvThreshold}
                onChange={(e) => handleSliderChange('cvThreshold', parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 font-normal">Controls how aggressively layout irregularities or pixel compression issues skew overall risk score.</p>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">NLP Semantic Verification Weight ({settings.nlpThreshold}%)</span>
                <span className="text-indigo-600">{settings.nlpThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.nlpThreshold}
                onChange={(e) => handleSliderChange('nlpThreshold', parseInt(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 font-normal">Controls how much weight calculation error logic or mismatching dates have in risk determination.</p>
            </div>

            {/* Auto approve toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200/50">
              <div>
                <h4 className="font-bold text-slate-800">Auto-Approve Clean Documents</h4>
                <p className="text-[10px] text-slate-400">Instantly resolve and approve cases with a fraud risk under 15%.</p>
              </div>
              <button
                onClick={handleToggleAutoApprove}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  settings.autoApprove ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  settings.autoApprove ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Panel 4: Webhook & Integration */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/60 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="w-4.5 h-4.5 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Integrations & Credentials</h3>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 font-bold">Corporate Webhook Endpoint URL</label>
              <input
                type="text"
                placeholder="e.g. https://api.yourbank.com/v1/fraud-events"
                defaultValue="https://api.yourbank.com/v1/fraud-events"
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-slate-500 font-bold">API Secret Key (X-FraudShield-Secret)</label>
              <div className="relative">
                <input
                  type="password"
                  disabled
                  defaultValue="fs_secops_key_8802998a44b1c8f1e29c8821ad"
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-400 font-mono pr-20"
                />
                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[9px] font-black uppercase text-indigo-600 bg-white border border-indigo-100 px-2 py-1 rounded-md cursor-pointer hover:bg-indigo-50">
                  <RefreshCw className="w-2.5 h-2.5" />
                  Regen
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
