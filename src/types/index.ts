export interface Document {
  id: string;
  title: string;
  content: string;
  source: 'google-drive' | 'google-docs' | 'notion' | 'confluence' | 'upload';
  sourceId: string;
  lastModified: Date;
  url?: string;
  metadata: {
    author?: string;
    tags?: string[];
    department?: string;
    sectionTitle?: string;
    lineNumber?: number;
  };
}

export interface SearchResult {
  document: Document;
  relevanceScore: number;
  snippet: string;
  highlightedText: string;
}

export interface ConnectionStatus {
  id: string;
  name: string;
  connected: boolean;
  lastSync?: Date;
  documentsCount?: number;
  syncInProgress?: boolean;
  error?: string;
}

export interface QueryLog {
  id: string;
  query: string;
  userId: string;
  timestamp: Date;
  answered: boolean;
  responseTime: number;
  feedback?: 'up' | 'down';
  sources?: string[];
}

export interface UserFeedback {
  messageId: string;
  type: 'up' | 'down';
  timestamp: Date;
  userId: string;
  comment?: string;
}