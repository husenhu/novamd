
import React from 'react';
import { X, Moon, Sun, Monitor, ShieldCheck, Zap, Settings as SettingsIcon } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-blue-600" />
            App Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Appearance */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Appearance</h3>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-sm font-medium text-slate-700">Theme</span>
              <div className="flex bg-white p-1 rounded-lg border shadow-sm">
                <button className="p-1.5 rounded-md bg-blue-50 text-blue-600" title="Light Theme"><Sun size={16} /></button>
                <button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600" title="Dark Theme"><Moon size={16} /></button>
              </div>
            </div>
          </section>

          {/* AI Config */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">AI Configuration</h3>
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-300">Gemini API Status</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full uppercase">
                  <ShieldCheck size={10} />
                  Connected
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-1">
                The Gemini API key is securely managed by the system environment variables (process.env.API_KEY).
              </p>
              <p className="text-[11px] text-slate-400/80 italic">
                Manual key overrides are disabled for security reasons in this environment.
              </p>
            </div>
          </section>

          {/* About */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">About NovaMD</h3>
            <div className="text-sm text-slate-600 space-y-2 px-1">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-slate-500">Version</span>
                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">v1.1.2-beta</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Engine</span>
                <span className="font-mono text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Gemini-3-Flash-Preview</span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
