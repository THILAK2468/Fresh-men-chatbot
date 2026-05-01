import { useState } from 'react';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { AdminDashboard } from './components/AdminDashboard';
import { HistoryPage } from './components/HistoryPage';
import { DocumentUpload } from './components/DocumentUpload';

export type ViewType = 'chat' | 'upload' | 'admin' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('chat');
  
  // Hardcoded local user since authentication is removed
  const user = { id: 'local-user', email: 'local@user.com' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'chat' && <ChatInterface user={user} />}
        {currentView === 'upload' && <DocumentUpload />}
        {currentView === 'admin' && <AdminDashboard />}
        {currentView === 'history' && <HistoryPage user={user} />}
      </main>
    </div>
  );
}

export default App;