
import React, { useState } from 'react';
import { MDFile } from '../types';
import { 
  Plus, 
  Search, 
  FileText, 
  Trash2, 
  Upload, 
  X,
  Zap,
  Clock,
  Settings
} from 'lucide-react';

interface SidebarProps {
  files: MDFile[];
  activeFileId: string | null;
  onFileSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
  onImport: () => void;
  onSettingsOpen: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  files, 
  activeFileId, 
  onFileSelect, 
  onDelete, 
  onNew, 
  onImport,
  onSettingsOpen,
  isOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50
      w-72 bg-slate-900 text-slate-300 border-r border-slate-800
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-72'}
      flex flex-col
    `}>
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Zap size={18} fill="currentColor" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">NovaMD</h1>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-2 space-y-2">
        <button 
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg shadow-blue-900/20 font-medium"
        >
          <Plus size={18} />
          New Document
        </button>
        <button 
          onClick={onImport}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg transition-all border border-slate-700 text-sm"
        >
          <Upload size={16} />
          Import Local File
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative group">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4 mb-2">My Documents</div>
        {filteredFiles.length === 0 ? (
          <div className="p-8 text-center text-slate-600 text-sm">
            {searchQuery ? 'No results found.' : 'No documents yet.'}
          </div>
        ) : (
          <div className="space-y-0.5">
            {filteredFiles.map(file => (
              <div 
                key={file.id}
                onClick={() => onFileSelect(file.id)}
                className={`
                  group flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all
                  ${activeFileId === file.id 
                    ? 'bg-blue-600/10 text-blue-400 ring-1 ring-inset ring-blue-500/20' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                <FileText size={16} className={activeFileId === file.id ? 'text-blue-500' : 'text-slate-500'} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="text-[10px] opacity-50 flex items-center gap-1 mt-0.5">
                    <Clock size={10} />
                    {new Date(file.updatedAt).toLocaleDateString()}
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (confirm(`Delete "${file.name}"?`)) {
                        onDelete(file.id);
                    }
                  }}
                  className={`
                    p-2 -mr-2 text-slate-500 hover:text-red-400 transition-all rounded-md hover:bg-red-400/10
                    lg:opacity-0 lg:group-hover:opacity-100
                  `}
                  title="Delete file"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Settings/Meta */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <button 
          onClick={onSettingsOpen}
          className="w-full flex items-center gap-3 px-2 py-2 text-sm text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
