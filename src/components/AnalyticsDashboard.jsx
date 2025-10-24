import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Clock,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import { cn } from '../lib/utils';

// Mock analytics data
const generateMockData = () => ({
  overview: {
    totalMessages: 1247,
    totalChats: 23,
    activeUsers: 8,
    avgResponseTime: '2.3 min',
    trends: {
      messages: '+12%',
      chats: '+3%',
      users: '+1%',
      responseTime: '-15%'
    }
  },
  messagesByPlatform: [
    { platform: 'WhatsApp', count: 456, color: '#25D366' },
    { platform: 'Slack', count: 342, color: '#4A154B' },
    { platform: 'Teams', count: 234, color: '#6264A7' },
    { platform: 'Discord', count: 156, color: '#5865F2' },
    { platform: 'Telegram', count: 59, color: '#0088CC' }
  ],
  activityByHour: Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    messages: Math.floor(Math.random() * 50) + 10
  })),
  sentimentTrend: [
    { date: '2024-01-01', positive: 65, neutral: 25, negative: 10 },
    { date: '2024-01-02', positive: 70, neutral: 20, negative: 10 },
    { date: '2024-01-03', positive: 68, neutral: 22, negative: 10 },
    { date: '2024-01-04', positive: 72, neutral: 18, negative: 10 },
    { date: '2024-01-05', positive: 75, neutral: 15, negative: 10 }
  ],
  topContacts: [
    { name: 'Sarah Johnson', messages: 89, platform: 'Slack' },
    { name: 'Mike Chen', messages: 76, platform: 'WhatsApp' },
    { name: 'Alex Rivera', messages: 65, platform: 'Teams' },
    { name: 'Emma Davis', messages: 54, platform: 'Discord' },
    { name: 'Tom Wilson', messages: 43, platform: 'Telegram' }
  ]
});

export function AnalyticsDashboard({ className }) {
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('messages');

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setData(generateMockData());
    }, 500);

    return () => clearTimeout(timer);
  }, [timeRange]);

  if (!data) {
    return (
      <div className={cn("flex items-center justify-center h-96", className)}>
        <div className="text-center">
          <BarChart3 size={48} className="mx-auto mb-4 text-gray-300 animate-pulse" />
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 qet-brand">Analytics Dashboard</h2>
          <p className="text-gray-600 qet-text">Communication insights and performance metrics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg qet-input"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={16} className="text-gray-600" />
          </button>
          
          <button className="qet-button px-4 py-2 flex items-center space-x-2">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Messages"
          value={data.overview.totalMessages.toLocaleString()}
          trend={data.overview.trends.messages}
          icon={MessageSquare}
          color="blue"
        />
        <MetricCard
          title="Active Chats"
          value={data.overview.totalChats}
          trend={data.overview.trends.chats}
          icon={Users}
          color="green"
        />
        <MetricCard
          title="Active Users"
          value={data.overview.activeUsers}
          trend={data.overview.trends.users}
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Avg Response Time"
          value={data.overview.avgResponseTime}
          trend={data.overview.trends.responseTime}
          icon={Clock}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages by Platform */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages by Platform</h3>
          <div className="space-y-3">
            {data.messagesByPlatform.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{platform.platform}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{platform.count}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: platform.color,
                        width: `${(platform.count / Math.max(...data.messagesByPlatform.map(p => p.count))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity by Hour */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity by Hour</h3>
          <div className="h-48 flex items-end justify-between space-x-1">
            {data.activityByHour.map((hour) => (
              <div key={hour.hour} className="flex flex-col items-center">
                <div 
                  className="w-3 bg-[var(--qet-lime)] rounded-t"
                  style={{ height: `${(hour.messages / 60) * 100}%` }}
                  title={`${hour.hour}:00 - ${hour.messages} messages`}
                />
                {hour.hour % 4 === 0 && (
                  <span className="text-xs text-gray-500 mt-1">{hour.hour}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Trend */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trend</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Positive</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span>Neutral</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Negative</span>
              </div>
            </div>
            <div className="h-32 flex items-end justify-between space-x-2">
              {data.sentimentTrend.map((day, index) => (
                <div key={day.date} className="flex flex-col w-full">
                  <div className="flex flex-col h-24">
                    <div 
                      className="bg-green-500 rounded-t"
                      style={{ height: `${day.positive}%` }}
                    />
                    <div 
                      className="bg-gray-400"
                      style={{ height: `${day.neutral}%` }}
                    />
                    <div 
                      className="bg-red-500 rounded-b"
                      style={{ height: `${day.negative}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 mt-1 text-center">
                    {new Date(day.date).getDate()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Contacts */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Active Contacts</h3>
          <div className="space-y-3">
            {data.topContacts.map((contact, index) => (
              <div key={contact.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.platform}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600">{contact.messages}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, icon: Icon, color }) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  const isPositive = trend.startsWith('+') || trend.startsWith('-') && title.includes('Response Time');
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", colorClasses[color])}>
          <Icon size={20} />
        </div>
        <div className={cn(
          "flex items-center space-x-1 text-sm",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          <TrendingUp size={14} className={isPositive ? "" : "rotate-180"} />
          <span>{trend}</span>
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
}

