
import { MessageSquare, Upload, BarChart3, Brain, History, User } from 'lucide-react';
import type { ViewType } from '../App';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  user: any;
}

export function Header({ currentView, onViewChange, user }: HeaderProps) {
  const navItems = [
    { id: 'chat' as ViewType, label: 'Assistant', icon: MessageSquare },
    { id: 'upload' as ViewType, label: 'Upload', icon: Upload },
    { id: 'admin' as ViewType, label: 'Analytics', icon: BarChart3 },
    { id: 'history' as ViewType, label: 'History', icon: History },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Company Assistant</h1>
            <p className="text-xs text-gray-500">Intelligent document search & Q&A</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
            </nav>

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700 hidden sm:inline">
                  {user?.user_metadata?.username || user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}