import React, { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Search, 
  Bell, 
  Calendar,
  FileText,
  Zap,
  BarChart3,
  Plus,
  Filter,
  Archive,
  Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Logo } from './Logo';
import { WorkflowPanel } from './WorkflowPanel';

const sidebarSections = [
  {
    title: 'Communication',
    items: [
      { id: 'chats', icon: MessageSquare, label: 'All Chats', count: 12 },
      { id: 'unread', icon: Bell, label: 'Unread', count: 3 },
      { id: 'starred', icon: Star, label: 'Starred', count: 5 },
      { id: 'archived', icon: Archive, label: 'Archived', count: 8 }
    ]
  },
  {
    title: 'Productivity',
    items: [
      { id: 'tasks', icon: FileText, label: 'Tasks', count: 7 },
      { id: 'calendar', icon: Calendar, label: 'Calendar' },
      { id: 'workflows', icon: Zap, label: 'Workflows' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics' }
    ]
  },
  {
    title: 'Teams',
    items: [
      { id: 'teams', icon: Users, label: 'Team Chats', count: 4 }
    ]
  }
];

export function EnhancedSidebar({ 
  selectedPlatform, 
  onPlatformChange, 
  selectedView, 
  onViewChange,
  className 
}) {
  const [showWorkflows, setShowWorkflows] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewChange = (viewId) => {
    if (viewId === 'workflows') {
      setShowWorkflows(!showWorkflows);
    } else {
      onViewChange(viewId);
      setShowWorkflows(false);
    }
  };

  return (
    <div className={cn("w-80 bg-white border-r border-gray-200 flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Logo className="mb-4" />
        
        {/* Quick Actions */}
        <div className="flex space-x-2 mb-4">
          <button className="flex-1 qet-button text-sm py-2 flex items-center justify-center space-x-2">
            <Plus size={16} />
            <span>New Chat</span>
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg qet-input focus:border-[var(--qet-lime)] focus:ring-2 focus:ring-[var(--qet-lime)] focus:ring-opacity-20 text-sm"
          />
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto">
        {sidebarSections.map((section) => (
          <div key={section.title} className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = selectedView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleViewChange(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-[var(--qet-lime)] bg-opacity-10 text-[var(--qet-lime)] font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent size={16} />
                      <span>{item.label}</span>
                    </div>
                    {item.count && (
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        isActive
                          ? "bg-[var(--qet-lime)] text-white"
                          : "bg-gray-200 text-gray-600"
                      )}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Platform Filters */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Platforms
          </h3>
          <div className="space-y-1">
            {['all', 'whatsapp', 'telegram', 'slack', 'discord', 'teams'].map((platform) => (
              <button
                key={platform}
                onClick={() => onPlatformChange(platform)}
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors capitalize",
                  selectedPlatform === platform
                    ? "bg-[var(--qet-lime)] bg-opacity-10 text-[var(--qet-lime)] font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {platform === 'all' ? 'All Platforms' : platform}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow Panel */}
      {showWorkflows && (
        <div className="border-t border-gray-200">
          <WorkflowPanel className="border-0 rounded-none" />
        </div>
      )}

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}

