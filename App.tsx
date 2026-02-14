
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus,
  FileText,
  Trash2,
  Sidebar as SidebarIcon,
  Eye,
  Edit3,
  Columns,
  Download,
  Upload,
  Sparkles,
  Menu,
  X,
  ChevronLeft,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { MDFile, AppState, AIAction } from './types';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import SettingsModal from './components/SettingsModal';
import { processTextWithAI } from './services/geminiService';

const LOCAL_STORAGE_KEY = 'novamd_files_v1';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    files: [],
    activeFileId: null,
    isSidebarOpen: true,
    viewMode: window.innerWidth < 768 ? 'edit' : 'split',
    isAILoading: false,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [displayTitle, setDisplayTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = state.files.find(f => f.id === state.activeFileId) || null;

  // Sync displayTitle with activeFile when it changes
  useEffect(() => {
    if (activeFile) {
      setDisplayTitle(activeFile.name.replace(/\.md$/, ''));
    } else {
      setDisplayTitle('');
    }
  }, [state.activeFileId, activeFile?.name]);

  // Initialize data
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed: MDFile[] = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          files: parsed,
          activeFileId: parsed.length > 0 ? parsed[0].id : null
        }));
      } catch (e) {
        console.error("Failed to parse saved files", e);
      }
    } else {
      const welcomeFile: MDFile = {
        id: 'welcome-' + Date.now(),
        name: 'Welcome to NovaMD.md',
        content: '# Welcome to NovaMD\n\nNovaMD is your **AI-powered** Markdown Studio.\n\n### Features:\n- 📝 **Real-time Preview**: See your changes as you type.\n- 🤖 **Gemini AI**: Polish, summarize, and transform your writing.\n- 💾 **Local Drive**: Open and save files directly from your device.\n- 📱 **Mobile First**: Fully responsive design for on-the-go editing.\n\nStart typing here or import a file from your computer!',
        updatedAt: Date.now()
      };
      setState(prev => ({
        ...prev,
        files: [welcomeFile],
        activeFileId: welcomeFile.id
      }));
    }
  }, []);

  // Save to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.files));
  }, [state.files]);

  const createNewFile = useCallback(() => {
    const newFile: MDFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Untitled.md',
      content: '',
      updatedAt: Date.now()
    };
    setState(prev => ({
      ...prev,
      files: [newFile, ...prev.files],
      activeFileId: newFile.id,
      isSidebarOpen: window.innerWidth < 1024 ? false : prev.isSidebarOpen
    }));
  }, []);

  const updateFileContent = useCallback((content: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(f =>
        f.id === prev.activeFileId
          ? { ...f, content, updatedAt: Date.now() }
          : f
      )
    }));
  }, []);

  const commitFileName = useCallback((name: string) => {
    const cleanName = name.trim() || 'Untitled';
    const safeName = cleanName.endsWith('.md') ? cleanName : `${cleanName}.md`;
    setState(prev => ({
      ...prev,
      files: prev.files.map(f =>
        f.id === prev.activeFileId
          ? { ...f, name: safeName, updatedAt: Date.now() }
          : f
      )
    }));
  }, [state.activeFileId]);

  const deleteFile = useCallback((id: string) => {
    setState(prev => {
      const remaining = prev.files.filter(f => f.id !== id);
      const nextActiveId = prev.activeFileId === id
        ? (remaining.length > 0 ? remaining[0].id : null)
        : prev.activeFileId;

      return {
        ...prev,
        files: remaining,
        activeFileId: nextActiveId
      };
    });
  }, []);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const newFile: MDFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name.endsWith('.md') ? file.name : `${file.name}.md`,
        content,
        updatedAt: Date.now()
      };
      setState(prev => ({
        ...prev,
        files: [newFile, ...prev.files],
        activeFileId: newFile.id
      }));
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExport = () => {
    if (!activeFile) return;
    const blob = new Blob([activeFile.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAIAction = async (action: AIAction) => {
    if (!activeFile || state.isAILoading) return;
    setState(prev => ({ ...prev, isAILoading: true }));
    try {
      const result = await processTextWithAI(activeFile.content, action);

      if (result.startsWith('Error:')) {
        // Handle error without overwriting content
        console.error(result);
        alert(result); // Simple alert for now, could be a toast
        return;
      }

      if (action === 'summarize') {
        updateFileContent(`${activeFile.content}\n\n---\n## AI Summary\n${result}`);
      } else if (action === 'expand') {
        updateFileContent(`${activeFile.content}\n\n${result}`);
      } else {
        updateFileContent(result);
      }
    } catch (error) {
      console.error("AI Action Failed:", error);
      alert("Failed to process AI action. Please try again.");
    } finally {
      setState(prev => ({ ...prev, isAILoading: false }));
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50">
      {state.isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setState(prev => ({ ...prev, isSidebarOpen: false }))}
        />
      )}

      <Sidebar
        files={state.files}
        activeFileId={state.activeFileId}
        onFileSelect={(id) => setState(prev => ({
          ...prev,
          activeFileId: id,
          isSidebarOpen: window.innerWidth < 1024 ? false : prev.isSidebarOpen
        }))}
        onDelete={deleteFile}
        onNew={createNewFile}
        onImport={() => fileInputRef.current?.click()}
        onSettingsOpen={() => setIsSettingsOpen(true)}
        isOpen={state.isSidebarOpen}
        onToggle={() => setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }))}
      />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".md,.txt,.markdown"
        onChange={handleImport}
      />

      <main className={`flex-1 flex flex-col min-w-0 transition-all duration-300 relative`}>
        <header className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => setState(prev => ({ ...prev, isSidebarOpen: !prev.isSidebarOpen }))}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <Menu size={20} />
            </button>

            {activeFile ? (
              <div className="flex items-center gap-2 min-w-0 flex-1 max-w-md">
                <FileText size={18} className="text-blue-600 shrink-0" />
                <input
                  type="text"
                  value={displayTitle}
                  onChange={(e) => setDisplayTitle(e.target.value)}
                  onBlur={(e) => commitFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      commitFileName(displayTitle);
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  className="text-sm font-semibold bg-transparent border-none focus:ring-2 focus:ring-blue-500/20 rounded px-2 py-1 focus:outline-none truncate w-full hover:bg-slate-50 transition-colors"
                  placeholder="Document Title"
                />
              </div>
            ) : (
              <span className="text-sm font-medium text-slate-400">No file selected</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <div className="hidden sm:flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setState(prev => ({ ...prev, viewMode: 'edit' }))}
                className={`p-1.5 rounded-md transition-all ${state.viewMode === 'edit' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="Edit Mode"
              >
                <Edit3 size={18} />
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, viewMode: 'preview' }))}
                className={`p-1.5 rounded-md transition-all ${state.viewMode === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="Preview Mode"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => setState(prev => ({ ...prev, viewMode: 'split' }))}
                className={`hidden md:block p-1.5 rounded-md transition-all ${state.viewMode === 'split' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                title="Split View"
              >
                <Columns size={18} />
              </button>
            </div>

            <button
              onClick={handleExport}
              disabled={!activeFile}
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
              title="Download MD"
            >
              <Download size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeFile ? (
            <Editor
              content={activeFile.content}
              onChange={updateFileContent}
              viewMode={state.viewMode}
              onAIAction={handleAIAction}
              isAILoading={state.isAILoading}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <FileText size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-600">No active document</h3>
              <p className="mt-2 max-w-xs">Select a file from the sidebar or create a new one to start writing.</p>
              <button
                onClick={createNewFile}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                New Document
              </button>
            </div>
          )}
        </div>

        <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-xl border rounded-full px-2 py-1.5 flex gap-1 z-30">
          <button
            onClick={() => setState(prev => ({ ...prev, viewMode: 'edit' }))}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${state.viewMode === 'edit' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setState(prev => ({ ...prev, viewMode: 'preview' }))}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${state.viewMode === 'preview' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500'}`}
          >
            Preview
          </button>
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;
