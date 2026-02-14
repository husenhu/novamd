
export interface MDFile {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

export interface AppState {
  files: MDFile[];
  activeFileId: string | null;
  isSidebarOpen: boolean;
  viewMode: 'edit' | 'preview' | 'split';
  isAILoading: boolean;
}

export type AIAction = 'polish' | 'summarize' | 'expand' | 'tone-professional' | 'tone-creative';
