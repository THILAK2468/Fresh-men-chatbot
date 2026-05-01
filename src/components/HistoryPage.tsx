import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, User, MessageSquare, ThumbsUp, ThumbsDown, Clock, FileText, ExternalLink } from 'lucide-react';

interface HistoryEntry {
  id: string;
  type: 'query' | 'upload' | 'connection';
  timestamp: Date;
  user: string;
  content: string;
  details?: {
    query?: string;
    response?: string;
    sources?: Array<{
      title: string;
      link: string;
      snippet: string;
    }>;
    feedback?: 'up' | 'down';
    responseTime?: number;
    fileName?: string;
    fileSize?: string;
    connectionName?: string;
    status?: 'success' | 'error' | 'processing';
  };
}

interface HistoryPageProps {
  user: any;
}

export function HistoryPage({ user }: HistoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'query' | 'upload' | 'connection'>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);


  useEffect(() => {
    fetchHistory();
  }, [user.id]);

  const fetchHistory = async () => {
    try {
      const queries = JSON.parse(localStorage.getItem('mock_queries') || '[]');
      const userQueries = queries.filter((q: any) => q.user_id === user.id)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 50);

      const entries: HistoryEntry[] = userQueries.map((query: any) => ({
        id: query.id,
        type: 'query' as const,
        timestamp: new Date(query.created_at),
        user: user.email,
        content: query.query,
        details: {
          query: query.query,
          response: query.response,
          sources: query.sources,
          feedback: query.feedback,
          responseTime: query.response_time
        }
      }));

      setHistoryEntries(entries);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const filteredEntries = historyEntries.filter(entry => {
    const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || entry.type === filterType;
    
    let matchesDate = true;
    const now = new Date();
    const entryDate = entry.timestamp;
    
    switch (dateRange) {
      case 'today':
        matchesDate = entryDate.toDateString() === now.toDateString();
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = entryDate >= weekAgo;
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = entryDate >= monthAgo;
        break;
      default:
        matchesDate = true;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'query':
        return <MessageSquare className="w-4 h-4" />;
      case 'upload':
        return <FileText className="w-4 h-4" />;
      case 'connection':
        return <ExternalLink className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'query':
        return 'bg-blue-100 text-blue-800';
      case 'upload':
        return 'bg-green-100 text-green-800';
      case 'connection':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Activity History</h2>
            <p className="text-gray-600 mt-1">Track all queries, uploads, and connections</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Activities</option>
            <option value="query">Queries</option>
            <option value="upload">Uploads</option>
            <option value="connection">Connections</option>
          </select>

          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>

          <div className="ml-auto text-sm text-gray-500">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </div>
        </div>
      </div>

      {/* History Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(entry.type)}`}>
                    {getTypeIcon(entry.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{entry.content}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(entry.type)}`}>
                        {entry.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{entry.user}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{entry.timestamp.toLocaleString()}</span>
                      </div>
                      {entry.details?.responseTime && (
                        <div className="flex items-center space-x-1">
                          <span>Response: {entry.details.responseTime}s</span>
                        </div>
                      )}
                    </div>

                    {/* Query Details */}
                    {entry.type === 'query' && entry.details && (
                      <div className="space-y-3">
                        {entry.details.response && (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-700">{entry.details.response}</p>
                          </div>
                        )}
                        
                        {entry.details.sources && entry.details.sources.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Sources:</p>
                            {entry.details.sources.map((source, index) => (
                              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium text-blue-900">{source.title}</h4>
                                    <p className="text-sm text-blue-800 mt-1">{source.snippet}</p>
                                  </div>
                                  <a
                                    href={source.link}
                                    className="text-blue-600 hover:text-blue-800 transition-colors ml-2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {entry.details.feedback && (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">User feedback:</span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              entry.details.feedback === 'up' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              {entry.details.feedback === 'up' ? (
                                <ThumbsUp className="w-3 h-3 text-green-600" />
                              ) : (
                                <ThumbsDown className="w-3 h-3 text-red-600" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Upload Details */}
                    {entry.type === 'upload' && entry.details && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-900">{entry.details.fileName}</p>
                            <p className="text-sm text-green-700">Size: {entry.details.fileSize}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            entry.details.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.details.status}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Connection Details */}
                    {entry.type === 'connection' && entry.details && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-purple-900">
                            Successfully connected to {entry.details.connectionName}
                          </p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            entry.details.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.details.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No history found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' || dateRange !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start using the assistant to see your activity history here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}