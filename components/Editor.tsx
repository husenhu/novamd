
import React, { useState } from 'react';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { AIAction } from '../types';
import { Sparkles, Loader2, Wand2, BookOpen, Quote, Type, Plus } from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (val: string) => void;
  viewMode: 'edit' | 'preview' | 'split';
  onAIAction: (action: AIAction) => void;
  isAILoading: boolean;
}

const Editor: React.FC<EditorProps> = ({
  content,
  onChange,
  viewMode,
  onAIAction,
  isAILoading
}) => {
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Convert markdown to HTML string
  const getHtml = () => {
    try {
      return marked.parse(content || '*No content to preview*');
    } catch (e) {
      return "Error parsing markdown.";
    }
  };

  const aiTools = [
    { id: 'polish' as AIAction, label: 'Polish Writing', icon: <Sparkles size={14} />, desc: 'Improve grammar and flow', color: 'blue' },
    { id: 'summarize' as AIAction, label: 'Smart Summary', icon: <BookOpen size={14} />, desc: 'Extract key points', color: 'amber' },
    { id: 'expand' as AIAction, label: 'Expand Content', icon: <Plus size={14} />, desc: 'Add more detail', color: 'emerald' },
    { id: 'tone-professional' as AIAction, label: 'Professional Tone', icon: <Type size={14} />, desc: 'Make it sound formal', color: 'indigo' },
    { id: 'tone-creative' as AIAction, label: 'Creative Flair', icon: <Wand2 size={14} />, desc: 'Make it engaging', color: 'purple' },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600';
      case 'amber': return 'hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600';
      case 'emerald': return 'hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600';
      case 'indigo': return 'hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600';
      case 'purple': return 'hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600';
      default: return 'hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* AI Toolbar */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {aiTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => onAIAction(tool.id)}
              disabled={isAILoading || !content.trim()}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 transition-all text-slate-600 disabled:opacity-50 whitespace-nowrap ${getColorClasses(tool.color)}`}
            >
              {isAILoading ? <Loader2 size={14} className="animate-spin text-blue-500" /> : tool.icon}
              {tool.label}
            </button>
          ))}
        </div>

        {isAILoading && (
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-blue-600 font-bold uppercase tracking-widest animate-pulse">
            <Sparkles size={12} />
            Gemini Thinking...
          </div>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Input Pane */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`h-full flex flex-col bg-white ${viewMode === 'split' ? 'w-1/2 border-r' : 'w-full'}`}>
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Start writing in Markdown..."
              className="flex-1 p-6 md:p-8 text-base md:text-lg leading-relaxed focus:outline-none resize-none font-mono text-slate-700 placeholder:text-slate-300 bg-transparent custom-scrollbar"
              autoFocus
            />
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`h-full flex flex-col bg-white overflow-y-auto custom-scrollbar ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <div
              className="prose prose-slate prose-lg max-w-none p-6 md:p-8"
              dangerouslySetInnerHTML={{ __html: getHtml() }}
            />
          </div>
        )}
      </div>

      {/* Floating Status */}
      <div className="h-8 bg-slate-50 border-t flex items-center justify-between px-4 text-[10px] text-slate-400 font-medium">
        <div className="flex items-center gap-4">
          <span>{content.length} characters</span>
          <span>{content.trim() ? content.trim().split(/\s+/).length : 0} words</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span>Autosaved</span>
        </div>
      </div>
    </div>
  );
};

export default Editor;
