import React, { useState, useEffect } from 'react';
import { Zap, Settings, Play, Pause, Plus, Trash2, Edit } from 'lucide-react';
import { workflowService } from '../lib/workflowService';
import { cn } from '../lib/utils';

export function WorkflowPanel({ className }) {
  const [workflows, setWorkflows] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadWorkflows();
    loadStats();
  }, []);

  const loadWorkflows = () => {
    const allWorkflows = workflowService.getWorkflows();
    setWorkflows(allWorkflows);
  };

  const loadStats = () => {
    const workflowStats = workflowService.getWorkflowStats();
    setStats(workflowStats);
  };

  const toggleWorkflow = (workflowId, enabled) => {
    workflowService.toggleWorkflow(workflowId, enabled);
    loadWorkflows();
    loadStats();
  };

  const deleteWorkflow = (workflowId) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      workflowService.removeWorkflow(workflowId);
      loadWorkflows();
      loadStats();
    }
  };

  return (
    <div className={cn("bg-white border border-gray-200 rounded-lg", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap size={18} className="text-blue-500" />
            <h3 className="font-semibold text-gray-900">Workflow Automation</h3>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Create new workflow"
          >
            <Plus size={16} className="text-gray-600" />
          </button>
        </div>
        
        {stats && (
          <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-medium text-gray-900">{stats.totalWorkflows}</div>
              <div className="text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-green-600">{stats.enabledWorkflows}</div>
              <div className="text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="font-medium text-blue-600">{stats.totalTriggers}</div>
              <div className="text-gray-500">Triggers</div>
            </div>
          </div>
        )}
      </div>

      {/* Workflow List */}
      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {workflows.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <Zap size={24} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No workflows configured</p>
          </div>
        ) : (
          workflows.map((workflow) => (
            <WorkflowItem
              key={workflow.id}
              workflow={workflow}
              onToggle={toggleWorkflow}
              onDelete={deleteWorkflow}
            />
          ))
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="border-t border-gray-200 p-4">
          <CreateWorkflowForm
            onSubmit={(workflow) => {
              const validation = workflowService.validateWorkflow(workflow);
              if (validation.isValid) {
                workflowService.addWorkflow({
                  ...workflow,
                  id: `custom-${Date.now()}`
                });
                loadWorkflows();
                loadStats();
                setShowCreateForm(false);
              } else {
                alert('Validation errors:\n' + validation.errors.join('\n'));
              }
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}
    </div>
  );
}

function WorkflowItem({ workflow, onToggle, onDelete }) {
  const getTriggerDescription = (trigger) => {
    switch (trigger.type) {
      case 'keyword_match':
        return `Keywords: ${trigger.keywords.join(', ')}`;
      case 'sender_match':
        return `Senders: ${trigger.senders.join(', ')}`;
      case 'platform_match':
        return `Platforms: ${trigger.platforms.join(', ')}`;
      case 'incoming_message':
        return 'All incoming messages';
      default:
        return 'Custom trigger';
    }
  };

  const getActionDescription = (actions) => {
    return actions.map(action => {
      switch (action.type) {
        case 'auto_reply':
          return 'Auto-reply';
        case 'suggest_reply':
          return 'Suggest replies';
        case 'notification':
          return 'Send notification';
        case 'categorize':
          return 'Categorize message';
        default:
          return action.type;
      }
    }).join(', ');
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="font-medium text-gray-900">{workflow.name}</h4>
            <span className={cn(
              "px-2 py-1 text-xs rounded-full",
              workflow.enabled 
                ? "bg-green-100 text-green-700" 
                : "bg-gray-100 text-gray-500"
            )}>
              {workflow.enabled ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              <span className="font-medium">Trigger:</span> {getTriggerDescription(workflow.trigger)}
            </div>
            <div>
              <span className="font-medium">Actions:</span> {getActionDescription(workflow.actions)}
            </div>
            {workflow.triggerCount > 0 && (
              <div className="text-xs text-gray-500">
                Triggered {workflow.triggerCount} times
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <button
            onClick={() => onToggle(workflow.id, !workflow.enabled)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={workflow.enabled ? 'Disable workflow' : 'Enable workflow'}
          >
            {workflow.enabled ? (
              <Pause size={14} className="text-orange-500" />
            ) : (
              <Play size={14} className="text-green-500" />
            )}
          </button>
          
          {workflow.custom && (
            <button
              onClick={() => onDelete(workflow.id)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="Delete workflow"
            >
              <Trash2 size={14} className="text-red-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CreateWorkflowForm({ onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState('keyword_match');
  const [keywords, setKeywords] = useState('');
  const [actionType, setActionType] = useState('suggest_reply');
  const [actionMessage, setActionMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const workflow = {
      name,
      enabled: true,
      trigger: {
        type: triggerType,
        keywords: triggerType === 'keyword_match' ? keywords.split(',').map(k => k.trim()) : []
      },
      actions: [{
        type: actionType,
        message: actionMessage,
        suggestions: actionType === 'suggest_reply' ? ['Thanks!', 'Got it!', 'Will do!'] : undefined
      }],
      custom: true
    };

    onSubmit(workflow);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Workflow Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
          placeholder="Enter workflow name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Trigger
        </label>
        <select
          value={triggerType}
          onChange={(e) => setTriggerType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="keyword_match">Keyword Match</option>
          <option value="incoming_message">All Incoming Messages</option>
        </select>
      </div>

      {triggerType === 'keyword_match' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="meeting, urgent, help"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Action
        </label>
        <select
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="suggest_reply">Suggest Replies</option>
          <option value="auto_reply">Auto Reply</option>
          <option value="notification">Send Notification</option>
        </select>
      </div>

      {actionType === 'auto_reply' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reply Message
          </label>
          <textarea
            value={actionMessage}
            onChange={(e) => setActionMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            rows={2}
            placeholder="Enter auto-reply message"
            required
          />
        </div>
      )}

      <div className="flex space-x-2">
        <button
          type="submit"
          className="flex-1 qet-button text-sm py-2"
        >
          Create Workflow
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

