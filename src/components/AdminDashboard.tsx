import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, FileText, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';

interface QueryData {
  id: string;
  query: string;
  user: string;
  timestamp: Date;
  answered: boolean;
  feedback?: 'up' | 'down';
  responseTime: number;
}

interface StatsCard {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ComponentType<any>;
}

export function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  const stats: StatsCard[] = [
    {
      title: 'Total Queries',
      value: '1,247',
      change: '+12%',
      changeType: 'increase',
      icon: BarChart3,
    },
    {
      title: 'Successful Answers',
      value: '92.5%',
      change: '+2.1%',
      changeType: 'increase',
      icon: TrendingUp,
    },
    {
      title: 'Active Users',
      value: '89',
      change: '+5%',
      changeType: 'increase',
      icon: Users,
    },
    {
      title: 'Documents Indexed',
      value: '342',
      change: '+23',
      changeType: 'increase',
      icon: FileText,
    },
  ];

  const recentQueries: QueryData[] = [
    {
      id: '1',
      query: 'How do I apply for parental leave?',
      user: 'sarah.johnson@company.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      answered: true,
      feedback: 'up',
      responseTime: 1.2,
    },
    {
      id: '2',
      query: 'What are the remote work guidelines?',
      user: 'mike.chen@company.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      answered: true,
      feedback: 'up',
      responseTime: 0.8,
    },
    {
      id: '3',
      query: 'How to access the engineering deployment docs?',
      user: 'alex.rivera@company.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      answered: false,
      responseTime: 2.1,
    },
    {
      id: '4',
      query: 'Company expense reimbursement process',
      user: 'emily.davis@company.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 180),
      answered: true,
      feedback: 'down',
      responseTime: 1.5,
    },
  ];

  const topQuestions = [
    'How do I apply for time off?',
    'What are the remote work policies?',
    'Company holiday schedule',
    'Expense reimbursement process',
    'IT support contact information',
  ];

  const missedQuestions = [
    'New employee onboarding checklist',
    'Engineering deployment procedures',
    'Client data privacy guidelines',
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Monitor assistant performance and user engagement</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Time range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'increase' ? 'text-green-600' :
                      stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs previous period</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Queries */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Queries</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentQueries.map((query) => (
              <div key={query.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{query.query}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-500">{query.user}</span>
                      <span className="text-xs text-gray-500">
                        {query.timestamp.toLocaleTimeString()}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{query.responseTime}s</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {query.answered ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Answered
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Missed
                      </span>
                    )}
                    
                    {query.feedback && (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        query.feedback === 'up' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {query.feedback === 'up' ? (
                          <ThumbsUp className="w-3 h-3 text-green-600" />
                        ) : (
                          <ThumbsDown className="w-3 h-3 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Questions & Insights */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Questions</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {topQuestions.map((question, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 text-xs font-medium rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-700">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="px-6 py-4 border-b border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-900">Questions Requiring Attention</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-yellow-800 mb-4">
                These queries couldn't be answered and may need new documentation:
              </p>
              <ul className="space-y-2">
                {missedQuestions.map((question, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-800">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}