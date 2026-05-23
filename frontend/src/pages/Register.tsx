import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Loader2, Cpu, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { addLog } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Underwriter');
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please fill in all fields.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the corporate security audit terms.');
      return;
    }
    
    // Simulate enterprise onboarding request
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      addLog({
        category: 'System',
        agent: 'SecOps Auth',
        message: `New credentials requested for ${name} (${role})`,
        severity: 'warning'
      });
      
      // Auto-redirect to login after short delay
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    }, 1500);
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
              FRAUDSHIELD_REGISTRAR
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
              Request Platform Enrollment Credentials
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              New profiles must be authorized by your regional SecOps administrator. Access logs are archived for compliance verification.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[10px] leading-normal text-slate-400">
            <p className="text-slate-500 mb-1 border-b border-slate-800 pb-1 font-bold">SECURE PIPELINE KEYWORDS</p>
            <p>• Data Encryption: TLS 1.3 & AES-256-GCM</p>
            <p>• User Logs: Complies with SOC 2 Type II audits</p>
            <p>• Authentication: Vertex RBAC federated layers</p>
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
          {/* Success Banner */}
          {isSuccess ? (
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col items-center text-center space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-500 animate-bounce" />
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Credentials Request Sent</h3>
                <p className="text-xs text-slate-550 mt-1">
                  Your registration profile has been logged. Redirecting you to the authentication gate...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Request Credentials</h1>
                <p className="text-xs text-slate-500">Submit your registration details for SecOps authorization review.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
                    {error}
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="name" className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Vance"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 placeholder:text-slate-400 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="email" className="text-[10px] font-bold text-slate-400 uppercase">Enterprise Email</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus.vance@company.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 placeholder:text-slate-400 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="role" className="text-[10px] font-bold text-slate-400 uppercase">Organizational Role</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800 font-semibold"
                  >
                    <option value="Underwriter">Compliance Underwriter</option>
                    <option value="SecOps Administrator">SecOps Administrator</option>
                    <option value="Risk Officer">Risk Officer</option>
                    <option value="Auditor">Corporate Auditor</option>
                  </select>
                </div>

                {/* Audit Checklist Agreement */}
                <div className="flex items-start gap-2.5 py-1.5">
                  <input
                    id="agreed"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded-sm border-slate-350 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5"
                  />
                  <label htmlFor="agreed" className="text-[11px] text-slate-500 font-semibold cursor-pointer leading-normal">
                    I acknowledge that all document access, uploads, and decisions are logged for compliance monitoring.
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
                      Registering Request...
                    </>
                  ) : (
                    'Request Credentials'
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center text-xs text-slate-500">
                Already have credentials?{' '}
                <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
