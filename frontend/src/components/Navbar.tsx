import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  Search, 
  AlertTriangle, 
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { logs, documents } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter logs for warning/error to show in notifications
  const notificationLogs = logs.filter(l => l.severity === 'error' || l.severity === 'warning').slice(0, 5);
  const activeProcessing = documents.some(doc => doc.status === 'Processing');

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-8 h-18 bg-white/50 backdrop-blur-md border-b border-slate-200/50">
      {/* Left side: Search or context */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full lg:ml-0 ml-12">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search forensic reports, metadata, signatures..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/50 border border-slate-200/60 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right side: Badges and User Profile Actions */}
      <div className="flex items-center gap-4">
        {/* Real-time processing badge */}
        <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
          activeProcessing 
            ? 'bg-amber-50 text-amber-600 border border-amber-200/30' 
            : 'bg-emerald-50 text-emerald-600 border border-emerald-200/30'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            activeProcessing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'
          }`} />
          {activeProcessing ? 'Agent Pipeline Active' : 'System Guard Ready'}
        </div>

        {/* Vertex AI Mode Indicator */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50/50 border border-indigo-100 text-indigo-700 text-[10px] font-bold">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Vertex AI Active</span>
        </div>

        {/* Notifications Icon and Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200/60 rounded-xl hover:shadow-xs transition-all cursor-pointer"
          >
            <Bell className="w-4.5 h-4.5" />
            {notificationLogs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop to close notification panel */}
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowNotifications(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200/80 rounded-2xl shadow-xl z-40 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-200/50 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-800">Security Alerts</h3>
                    <span className="text-[10px] font-medium text-slate-400">Real-time logs</span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto scrollbar-thin">
                    {notificationLogs.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400">
                        No critical alerts found.
                      </div>
                    ) : (
                      notificationLogs.map((item) => (
                        <div key={item.id} className="p-3.5 hover:bg-slate-50/50 transition-colors flex gap-2.5">
                          {item.severity === 'error' ? (
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-slate-800 leading-tight">
                              {item.agent}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-0.5 truncate-2-lines line-clamp-2">
                              {item.message}
                            </p>
                            <span className="text-[9px] text-slate-400 mt-1 block">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-slate-100 bg-slate-50/30 text-center">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      Dismiss alerts
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
