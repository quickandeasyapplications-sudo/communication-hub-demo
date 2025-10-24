import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  User, 
  Flag,
  Filter,
  Search,
  MoreHorizontal,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { aiService } from '../lib/aiService';
import { useMockData } from '../hooks/useMockData';
import { formatMessageTime } from '../lib/utils';

// Mock task data
const generateMockTasks = () => [
  {
    id: 1,
    title: 'Follow up on client proposal',
    description: 'Send revised proposal to ABC Corp based on their feedback',
    completed: false,
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    assignee: 'Sarah Johnson',
    source: {
      type: 'message',
      platform: 'slack',
      chatId: 'abc-corp-channel',
      messageId: 'msg-123'
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    tags: ['client', 'proposal']
  },
  {
    id: 2,
    title: 'Schedule team meeting',
    description: 'Coordinate with team for weekly sync meeting',
    completed: true,
    priority: 'medium',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    assignee: 'Mike Chen',
    source: {
      type: 'message',
      platform: 'teams',
      chatId: 'dev-team',
      messageId: 'msg-456'
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    tags: ['meeting', 'team']
  },
  {
    id: 3,
    title: 'Review design mockups',
    description: 'Provide feedback on the new dashboard designs',
    completed: false,
    priority: 'medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    assignee: 'Alex Rivera',
    source: {
      type: 'message',
      platform: 'discord',
      chatId: 'design-review',
      messageId: 'msg-789'
    },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    tags: ['design', 'review']
  },
  {
    id: 4,
    title: 'Update project documentation',
    description: 'Add new API endpoints to the documentation',
    completed: false,
    priority: 'low',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    assignee: 'Emma Davis',
    source: {
      type: 'manual',
      platform: null,
      chatId: null,
      messageId: null
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    tags: ['documentation', 'api']
  }
];

export function TaskManager({ className }) {
  const [tasks, setTasks] = useState([]);
  // const { messages } = useMockData(); // Assuming useMockData is available in App.jsx context or passed down
  const [extractedTasks, setExtractedTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, completed, overdue
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Placeholder for fetching all messages from the main app state
  // This component should ideally receive all messages as a prop, but for now, we'll use a mock
  // In a real app, this would be a global state or context
  const { messages } = useMockData(); // Use the mock data hook to get all messages

  useEffect(() => {
    // 1. Load mock tasks (for initial demo data)
    const mockTasks = generateMockTasks();
    
    // 2. Extract tasks from messages using the AI service
    const extractTasks = async () => {
      const aiActionItems = await aiService.extractActionItems(messages);
      const newExtractedTasks = aiActionItems.map((item, index) => ({
        id: `ai-${index}-${Date.now()}`,
        title: item.content.length > 80 ? item.content.substring(0, 77) + '...' : item.content,
        description: `Source: Conversation from ${formatMessageTime(new Date())}. Responsible: ${item.responsible}`,
        completed: false,
        priority: item.priority,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default due date 1 week from now
        assignee: item.responsible,
        source: {
          type: 'ai-extracted',
          platform: 'N/A',
          chatId: 'N/A',
          messageId: 'N/A'
        },
        createdAt: new Date(),
        tags: ['ai-extracted']
      }));
      setExtractedTasks(newExtractedTasks);
      // Combine mock tasks and extracted tasks
      setTasks([...mockTasks, ...newExtractedTasks]);
    };

    extractTasks();
  }, [messages]); // Re-run when messages change

  const filteredTasks = tasks.filter(task => {
    // Apply search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Apply status filter
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'overdue':
        return !task.completed && new Date(task.dueDate) < new Date();
      default:
        return true;
    }
  });

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isOverdue = (task) => {
    return !task.completed && new Date(task.dueDate) < new Date();
  };

  return (
    <div className={cn("p-6 space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 qet-brand">Task Manager</h2>
          <p className="text-gray-600 qet-text">Manage tasks created from conversations</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="qet-button px-4 py-2 flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg qet-input focus:border-[var(--qet-lime)] focus:ring-2 focus:ring-[var(--qet-lime)] focus:ring-opacity-20"
          />
        </div>
        
        <div className="flex space-x-2">
          {['all', 'pending', 'completed', 'overdue'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize",
                filter === filterOption
                  ? "bg-[var(--qet-lime)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {filterOption}
            </button>
          ))}
        </div>
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{tasks.filter(t => !t.completed).length}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{tasks.filter(t => t.completed).length}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-600">{tasks.filter(t => isOverdue(t)).length}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No tasks found</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-700 text-sm mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
              isOverdue={isOverdue(task)}
              getPriorityColor={getPriorityColor}
            />
          ))
        )}
      </div>

      {/* Create Task Form */}
      {showCreateForm && (
        <CreateTaskForm
          onSubmit={(newTask) => {
            const task = {
              ...newTask,
              id: Math.max(...tasks.map(t => t.id), 0) + 1,
              completed: false,
              createdAt: new Date(),
              source: { type: 'manual', platform: null, chatId: null, messageId: null }
            };
            setTasks([...tasks, task]);
            setShowCreateForm(false);
          }}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}

function TaskItem({ task, onToggle, onDelete, isOverdue, getPriorityColor }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className={cn(
      "bg-white border rounded-lg p-4 transition-all duration-200",
      task.completed ? "border-gray-200 opacity-75" : "border-gray-200 hover:border-gray-300",
      isOverdue ? "border-red-200 bg-red-50" : ""
    )}>
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggle(task.id)}
          className="mt-1 transition-colors"
        >
          {task.completed ? (
            <CheckCircle2 size={20} className="text-green-600" />
          ) : (
            <Circle size={20} className="text-gray-400 hover:text-gray-600" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={cn(
                "font-medium",
                task.completed ? "line-through text-gray-500" : "text-gray-900"
              )}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <span className={cn(
                "px-2 py-1 text-xs font-medium rounded border",
                getPriorityColor(task.priority)
              )}>
                {task.priority}
              </span>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <MoreHorizontal size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>Due {formatMessageTime(task.dueDate)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>{task.assignee}</span>
            </div>
            
            {task.source.type === 'message' && (
              <div className="flex items-center space-x-1">
                <MessageSquare size={14} />
                <span>From {task.source.platform}</span>
              </div>
            )}
          </div>
          
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <span className="ml-2 text-gray-600">{formatMessageTime(task.createdAt)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Priority:</span>
              <span className="ml-2 text-gray-600 capitalize">{task.priority}</span>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button className="text-blue-600 hover:text-blue-700 text-sm">
              Edit
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Delete
            </button>
            {task.source.type === 'message' && (
              <button className="text-gray-600 hover:text-gray-700 text-sm">
                View Source
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateTaskForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignee: '',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueDate: new Date(formData.dueDate),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md qet-input"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md qet-input"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md qet-input"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md qet-input"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <input
              type="text"
              value={formData.assignee}
              onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md qet-input"
              placeholder="Enter assignee name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md qet-input"
              placeholder="e.g., urgent, client, meeting"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 qet-button py-2"
            >
              Create Task
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

