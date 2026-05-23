import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  UploadCloud, 
  ShieldAlert, 
  Cpu, 
  FileText, 
  FileWarning, 
  History, 
  BarChart3, 
  Settings,
  Shield,
  Activity,
  User,
  Menu,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { documents, settings, addLog } = useApp();
  const navigate = useNavigate();
  
  const highRiskCount = documents.filter(doc => doc.riskLevel === 'High' && doc.status === 'Completed').length;
  const processingCount = documents.filter(doc => doc.status === 'Processing').length;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload Center', path: '/upload', icon: UploadCloud, badge: processingCount > 0 ? `${processingCount} active` : undefined, badgeColor: 'bg-indigo-500/10 text-indigo-600' },
    { name: 'Fraud Analysis', path: '/analysis', icon: ShieldAlert, badge: highRiskCount > 0 ? `${highRiskCount}` : undefined, badgeColor: 'bg-red-500/10 text-red-600 animate-pulse' },
    { name: 'AI Agent Workflow', path: '/workflow', icon: Cpu },
    { name: 'Document Intelligence', path: '/intelligence', icon: FileText },
    { name: 'Risk Reports', path: '/reports', icon: FileWarning },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Audit Logs', path: '/audit', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-xl shadow-sm text-slate-700 hover:text-slate-900 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-xs lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-45 flex flex-col w-64 bg-white/70 backdrop-blur-xl border-r border-slate-200/60 transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-18 border-b border-slate-200/40">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 shadow-xs">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              FraudShield <span className="text-[9px] uppercase font-black px-1.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-100">AI</span>
            </div>
            <div className="text-[9px] text-slate-400 font-bold tracking-wider uppercase -mt-0.5">Forensic intelligence</div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 group ${
                  isActive
                    ? 'bg-slate-100/80 text-slate-900 border-l-2 border-slate-900 pl-2.5 shadow-xs'
                    : 'text-slate-555 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-4.5 h-4.5 transition-colors ${
                      isActive ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-700'
                    }`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Panel - AI Status & User */}
        <div className="p-4 border-t border-slate-200/50 bg-slate-50/30">
          {/* Active AI Status widget */}
          <div className="p-3 mb-4 rounded-xl bg-white/60 border border-slate-200/50 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Activity className="w-3 h-3 text-indigo-500 animate-pulse" />
                Vertex Engine
              </div>
              <span className="inline-flex items-center w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <div className="text-xs font-semibold text-slate-700 truncate">
              {settings.aiModel}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Latency: ~120ms • Integrity: 99.9%
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center justify-between border-t border-slate-200/30 pt-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200/60 shrink-0">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">Aradhay</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase truncate">Investigator</div>
              </div>
            </div>
            <button
              onClick={() => {
                addLog({
                  category: 'User',
                  agent: 'SecOps Auth',
                  message: `User session logged out manually.`,
                  severity: 'info'
                });
                navigate('/');
              }}
              title="Logout Session"
              className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
