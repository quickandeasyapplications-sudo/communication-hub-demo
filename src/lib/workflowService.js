// Workflow Automation Service for Communication Hub
// Provides automated responses, message routing, and workflow triggers

export class WorkflowService {
  constructor() {
    this.workflows = new Map();
    this.isEnabled = true;
    this.initializeDefaultWorkflows();
  }

  // Initialize default workflows
  initializeDefaultWorkflows() {
    // Auto-reply for out of office
    this.addWorkflow({
      id: 'out-of-office',
      name: 'Out of Office Auto-Reply',
      enabled: false,
      trigger: {
        type: 'incoming_message',
        conditions: ['always']
      },
      actions: [{
        type: 'auto_reply',
        message: 'Thank you for your message. I am currently out of office and will respond when I return.'
      }]
    });

    // Meeting request auto-response
    this.addWorkflow({
      id: 'meeting-request',
      name: 'Meeting Request Handler',
      enabled: true,
      trigger: {
        type: 'keyword_match',
        keywords: ['meeting', 'schedule', 'calendar', 'appointment']
      },
      actions: [{
        type: 'suggest_reply',
        suggestions: [
          'Let me check my calendar and get back to you',
          'What time works best for you?',
          'I\'ll send you a calendar invite'
        ]
      }]
    });

    // Urgent message notification
    this.addWorkflow({
      id: 'urgent-notification',
      name: 'Urgent Message Alert',
      enabled: true,
      trigger: {
        type: 'keyword_match',
        keywords: ['urgent', 'emergency', 'asap', 'critical']
      },
      actions: [{
        type: 'notification',
        priority: 'high',
        sound: true
      }]
    });

    // Project update routing
    this.addWorkflow({
      id: 'project-routing',
      name: 'Project Update Routing',
      enabled: true,
      trigger: {
        type: 'keyword_match',
        keywords: ['project', 'update', 'status', 'progress']
      },
      actions: [{
        type: 'categorize',
        category: 'project-updates'
      }]
    });
  }

  // Add a new workflow
  addWorkflow(workflow) {
    this.workflows.set(workflow.id, {
      ...workflow,
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      triggerCount: 0
    });
  }

  // Remove a workflow
  removeWorkflow(workflowId) {
    return this.workflows.delete(workflowId);
  }

  // Enable/disable a workflow
  toggleWorkflow(workflowId, enabled) {
    const workflow = this.workflows.get(workflowId);
    if (workflow) {
      workflow.enabled = enabled;
      return true;
    }
    return false;
  }

  // Process incoming message through workflows
  async processMessage(message, context = {}) {
    if (!this.isEnabled) return [];

    const triggeredActions = [];

    for (const [workflowId, workflow] of this.workflows) {
      if (!workflow.enabled) continue;

      try {
        const shouldTrigger = await this.evaluateTrigger(workflow.trigger, message, context);
        
        if (shouldTrigger) {
          // Update workflow stats
          workflow.lastTriggered = new Date().toISOString();
          workflow.triggerCount++;

          // Execute actions
          for (const action of workflow.actions) {
            const result = await this.executeAction(action, message, context);
            if (result) {
              triggeredActions.push({
                workflowId,
                workflowName: workflow.name,
                action: action.type,
                result
              });
            }
          }
        }
      } catch (error) {
        console.warn(`Workflow ${workflowId} failed:`, error);
      }
    }

    return triggeredActions;
  }

  // Evaluate if a trigger condition is met
  async evaluateTrigger(trigger, message, context) {
    switch (trigger.type) {
      case 'incoming_message':
        return !message.isOwn;
      
      case 'keyword_match':
        const content = message.content.toLowerCase();
        return trigger.keywords.some(keyword => content.includes(keyword.toLowerCase()));
      
      case 'sender_match':
        return trigger.senders.includes(message.sender);
      
      case 'platform_match':
        return trigger.platforms.includes(message.platform);
      
      case 'time_based':
        const now = new Date();
        const hour = now.getHours();
        return hour >= trigger.startHour && hour <= trigger.endHour;
      
      case 'sentiment_match':
        return context.sentiment && trigger.sentiments.includes(context.sentiment.sentiment);
      
      default:
        return false;
    }
  }

  // Execute a workflow action
  async executeAction(action, message, context) {
    switch (action.type) {
      case 'auto_reply':
        return {
          type: 'auto_reply',
          message: action.message,
          chatId: message.chatId,
          platform: message.platform
        };
      
      case 'suggest_reply':
        return {
          type: 'suggest_reply',
          suggestions: action.suggestions
        };
      
      case 'notification':
        return {
          type: 'notification',
          priority: action.priority || 'normal',
          sound: action.sound || false,
          message: `New ${action.priority || 'normal'} priority message from ${message.sender}`
        };
      
      case 'categorize':
        return {
          type: 'categorize',
          category: action.category,
          messageId: message.id
        };
      
      case 'forward':
        return {
          type: 'forward',
          destination: action.destination,
          messageId: message.id
        };
      
      case 'schedule_reminder':
        return {
          type: 'schedule_reminder',
          delay: action.delay || 3600000, // 1 hour default
          message: action.reminderMessage || 'Reminder: Follow up on this message'
        };
      
      default:
        return null;
    }
  }

  // Get all workflows
  getWorkflows() {
    return Array.from(this.workflows.values());
  }

  // Get workflow by ID
  getWorkflow(workflowId) {
    return this.workflows.get(workflowId);
  }

  // Get workflow statistics
  getWorkflowStats() {
    const stats = {
      totalWorkflows: this.workflows.size,
      enabledWorkflows: 0,
      totalTriggers: 0,
      mostTriggered: null
    };

    let maxTriggers = 0;

    for (const workflow of this.workflows.values()) {
      if (workflow.enabled) stats.enabledWorkflows++;
      stats.totalTriggers += workflow.triggerCount;
      
      if (workflow.triggerCount > maxTriggers) {
        maxTriggers = workflow.triggerCount;
        stats.mostTriggered = workflow.name;
      }
    }

    return stats;
  }

  // Create a custom workflow
  createCustomWorkflow(name, trigger, actions) {
    const id = `custom-${Date.now()}`;
    const workflow = {
      id,
      name,
      enabled: true,
      trigger,
      actions,
      custom: true
    };

    this.addWorkflow(workflow);
    return id;
  }

  // Validate workflow configuration
  validateWorkflow(workflow) {
    const errors = [];

    if (!workflow.name || workflow.name.trim() === '') {
      errors.push('Workflow name is required');
    }

    if (!workflow.trigger || !workflow.trigger.type) {
      errors.push('Workflow trigger is required');
    }

    if (!workflow.actions || workflow.actions.length === 0) {
      errors.push('At least one action is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const workflowService = new WorkflowService();

