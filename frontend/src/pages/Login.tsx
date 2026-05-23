import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Loader2, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { addLog } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    // Simulate enterprise login delay
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setIsLoading(false);
      addLog({
        category: 'User',
        agent: 'SecOps Auth',
        message: `Admin session authenticated successfully for ${email}`,
        severity: 'info'
      });
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left side: System status & branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-slate-300 border-r border-slate-800">
        {/* Subtle grid mesh background */}
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 shadow-md shadow-indigo-500/30 text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight">FraudShield AI</span>
            <span className="text-[9px] ml-1.5 uppercase font-bold px-1.5 py-0.5 rounded-sm bg-slate-800 text-indigo-400 border border-slate-700">SecOps</span>
          </div>
        </div>

        {/* Middle content: Platform Status */}
        <div className="relative z-10 space-y-6 max-w-md my-auto">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-[10px] font-mono">
              <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
              FRAUDSHIELD_DAEMON_v2.4
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
              Enterprise Document Forensics & Underwriting Intelligence
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify compliance parameters, analyze typographic deviations, and run consensus-based multi-agent signature audits.
            </p>
          </div>

          {/* Active node logs mock container */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[10px] leading-normal space-y-2 max-h-[160px] overflow-hidden">
            <div className="flex justify-between items-center text-slate-500 border-b border-slate-800 pb-1.5">
              <span>SYSTEM DAEMON LIVE SEEDS</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                ONLINE
              </span>
            </div>
            <p className="text-slate-400">&gt; Initializing local OCR matrix engines... <span className="text-emerald-400">[OK]</span></p>
            <p className="text-slate-400">&gt; Spawning parallel Swarm Agents... <span className="text-emerald-400">[OK]</span></p>
            <p className="text-slate-400">&gt; Mounting Vertex AI endpoints... <span className="text-indigo-400">connected</span></p>
            <p className="text-slate-400">&gt; Active compliance checklists loaded: 14 schemas</p>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-500">
          <span>System status: fully operational</span>
          <span>SLA Compliance: 99.99%</span>
        </div>
      </div>

      {/* Right side: Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-24 bg-white relative">
        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Access Control Login</h1>
            <p className="text-xs text-slate-500">Sign in with your enterprise credentials to access SecOps dashboard.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase">Enterprise Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fraudshield.net"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 placeholder:text-slate-400 font-semibold"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-[10px] font-bold text-slate-400 uppercase">Secret Password</label>
                <a href="#" className="text-[10px] text-indigo-600 font-bold hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 placeholder:text-slate-400 font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2 py-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded-sm border-slate-350 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-slate-500 font-semibold cursor-pointer">
                Trust this device for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Verifying Credentials...
                </>
              ) : (
                'Authenticate Session'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center text-xs text-slate-500">
            Don't have a SecOps profile?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Request credentials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
