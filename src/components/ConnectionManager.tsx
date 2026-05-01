import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface ConnectionStatus {
  id: string;
  name: string;
  connected: boolean;
  lastSync?: string;
  documentsCount?: number;
  authUrl: string;
  scopes: string;
  redirectUri: string;
}

export function ConnectionManager() {
  const [connections, setConnections] = useState<ConnectionStatus[]>([
    {
      id: 'notion',
      name: 'Notion',
      connected: true,
      lastSync: '2 hours ago',
      documentsCount: 43,
      authUrl: 'https://api.notion.com/v1/oauth/authorize?owner=user',
      scopes: 'read:content',
      redirectUri: '/auth/notion/callback',
    },
    {
      id: 'confluence',
      name: 'Confluence',
      connected: false,
      authUrl: 'https://auth.atlassian.com/authorize',
      scopes: 'read:confluence-content.all',
      redirectUri: '/auth/confluence/callback',
    },
  ]);

  const [syncing, setSyncing] = useState<string | null>(null);

  const handleConnect = async (connection: ConnectionStatus) => {
    if (connection.connected) {
      // Start sync
      setSyncing(connection.id);
      
      // Simulate sync process
      setTimeout(() => {
        setConnections(prev => prev.map(conn => 
          conn.id === connection.id 
            ? { ...conn, lastSync: 'Just now', documentsCount: (conn.documentsCount || 0) + Math.floor(Math.random() * 5) }
            : conn
        ));
        setSyncing(null);
      }, 2000);
    } else {
      // Open OAuth in new window to avoid iframe restrictions
      const params = new URLSearchParams({
        audience: 'api.atlassian.com',
        client_id: connection.id === 'confluence' ? 'your-confluence-client-id' : 'your-client-id',
        redirect_uri: window.location.origin + connection.redirectUri,
        scope: connection.scopes,
        response_type: 'code',
        state: 'secure-random-' + Math.random().toString(36).substring(7),
        prompt: 'consent',
      });
      
      // Open in new window to avoid iframe restrictions (especially for Atlassian)
      const authWindow = window.open(
        `${connection.authUrl}?${params.toString()}`,
        'oauth-window',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );
      
      // Listen for the callback (in a real app, you'd handle this via postMessage)
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          // Simulate successful connection after window closes
          setTimeout(() => {
            setConnections(prev => prev.map(conn => 
              conn.id === connection.id 
                ? { ...conn, connected: true, lastSync: 'Just now', documentsCount: Math.floor(Math.random() * 50) + 10 }
                : conn
            ));
          }, 1000);
        }
      }, 1000);
    }
  };

  const handleDisconnect = (connectionId: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === connectionId 
        ? { ...conn, connected: false, lastSync: undefined, documentsCount: undefined }
        : conn
    ));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Document Sources</h2>
          <p className="text-sm text-gray-600 mt-1">
            Connect your company's document sources to enable intelligent search and Q&A
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {connections.map((connection) => (
            <div key={connection.id} className="px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    connection.connected ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {connection.connected ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{connection.name}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className={`text-sm ${
                        connection.connected ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {connection.connected ? 'Connected' : 'Not connected'}
                      </span>
                      {connection.lastSync && (
                        <span className="text-sm text-gray-500">
                          Last sync: {connection.lastSync}
                        </span>
                      )}
                      {connection.documentsCount && (
                        <span className="text-sm text-gray-500">
                          {connection.documentsCount} documents indexed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {connection.connected && (
                    <button
                      onClick={() => handleConnect(connection)}
                      disabled={syncing === connection.id}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                    >
                      {syncing === connection.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Syncing...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          <span>Sync Now</span>
                        </>
                      )}
                    </button>
                  )}
                  
                  {connection.connected ? (
                    <button
                      onClick={() => handleDisconnect(connection.id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(connection)}
                      className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Connect</span>
                    </button>
                  )}
                </div>
              </div>

              {connection.connected && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Connection Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Scopes:</span>
                      <span className="ml-2 text-gray-900">{connection.scopes}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Callback:</span>
                      <span className="ml-2 text-gray-900 font-mono text-xs">{connection.redirectUri}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">OAuth Implementation Notes</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>• Each "Connect" button redirects to the respective OAuth authorization URL</p>
          <p>• After authorization, the callback endpoint exchanges the code for an access token</p>
          <p>• Tokens are stored securely and used for background document syncing</p>
          <p>• The sync process indexes documents for intelligent search and Q&A</p>
        </div>
      </div>
    </div>
  );
}