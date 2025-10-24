// AI Service for Communication Hub
// Provides sentiment analysis, smart replies, and message categorization
import { OpenAI } from 'openai';

export class AIService {
  constructor() {
    this.isEnabled = true;
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
    this.baseURL = import.meta.env.VITE_OPENAI_API_BASE || 'https://api.openai.com/v1';
    this.model = 'gpt-4.1-mini'; // Use a fast and capable model
    
    if (this.apiKey) {
      // Initialize the OpenAI client only if the API key is present
      this.openai = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.baseURL,
        dangerouslyAllowBrowser: true, // Required for client-side usage with Vite environment variables
      });
    } else {
      this.openai = null;
      this.isEnabled = false;
      console.warn("OpenAI API key not found. Using fallback rule-based AI features.");
    }
  }

  // Check if AI features are available
  isAvailable() {
    return this.isEnabled && this.openai;
  }

  // --- Core AI Functions ---

  // Analyze message sentiment
  async analyzeSentiment(message) {
    if (!this.isAvailable()) {
      return this.getFallbackSentiment(message);
    }

    try {
      const prompt = `Analyze the sentiment of the following message. Respond only with a JSON object in the format: {"sentiment": "positive" | "negative" | "neutral", "confidence": 0.0 to 1.0}. Message: "${message}"`;
      
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;

    } catch (error) {
      console.error('OpenAI Sentiment analysis failed:', error);
      return this.getFallbackSentiment(message);
    }
  }

  // Generate smart reply suggestions
  async generateSmartReplies(conversation, currentMessage) {
    if (!this.isAvailable()) {
      return this.getFallbackReplies(currentMessage);
    }

    try {
      const conversationHistory = conversation.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
      const prompt = `Based on the following conversation history and the latest message, generate three concise and appropriate smart reply suggestions. Respond only with a JSON array of strings in the format: ["Reply 1", "Reply 2", "Reply 3"].
Conversation History:
---
${conversationHistory}
---
Latest Message: "${currentMessage}"`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.5,
      });

      const result = JSON.parse(response.choices[0].message.content);
      // Assuming the result is an object like { replies: ["...", "...", "..."] } or directly ["...", "...", "..."]
      return Array.isArray(result) ? result : result.replies || this.getFallbackReplies(currentMessage);

    } catch (error) {
      console.error('OpenAI Smart reply generation failed:', error);
      return this.getFallbackReplies(currentMessage);
    }
  }

  // Categorize messages
  async categorizeMessage(message) {
    if (!this.isAvailable()) {
      return this.getFallbackCategory(message);
    }

    try {
      const categories = ['urgent', 'meeting', 'work', 'support', 'general', 'feedback', 'sales'];
      const prompt = `Categorize the following message into one of these categories: ${categories.join(', ')}. Respond only with a JSON object in the format: {"category": "category_name", "confidence": 0.0 to 1.0}. Message: "${message}"`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.1,
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;

    } catch (error) {
      console.error('OpenAI Message categorization failed:', error);
      return this.getFallbackCategory(message);
    }
  }

  // Extract action items from messages
  async extractActionItems(messages) {
    if (!this.isAvailable()) {
      return this.getBasicActionItems(messages);
    }
    
    try {
      const messagesText = messages.map(msg => `[${msg.sender} at ${new Date(msg.timestamp).toLocaleTimeString()}] ${msg.content}`).join('\n');
      const prompt = `Review the following messages and extract all clear action items, tasks, or follow-ups. For each item, provide a concise description, the person responsible (if mentioned, otherwise 'Unknown'), and a priority ('high', 'medium', or 'low'). Respond only with a JSON array of objects in the format: [{"content": "...", "responsible": "...", "priority": "..."}]. If no action items are found, return an empty array [].
Messages:
---
${messagesText}
---`;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content);
      // The result should be an array of action items
      return Array.isArray(result) ? result : result.action_items || [];

    } catch (error) {
      console.error('OpenAI Action item extraction failed:', error);
      return this.getBasicActionItems(messages);
    }
  }

  // --- Fallback/Basic Functions (Kept for robustness) ---

  // Basic sentiment analysis using keywords (Fallback)
  getFallbackSentiment(message) {
    const positiveWords = ['good', 'great', 'excellent', 'awesome', 'love', 'happy', 'thanks', 'perfect', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'problem', 'issue', 'wrong'];
    
    const words = message.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;

    words.forEach(word => {
      if (positiveWords.includes(word)) positiveScore++;
      if (negativeWords.includes(word)) negativeScore++;
    });

    let sentiment = 'neutral';
    let confidence = 0.5;

    if (positiveScore > negativeScore) {
      sentiment = 'positive';
      confidence = Math.min(0.8, 0.5 + (positiveScore - negativeScore) * 0.1);
    } else if (negativeScore > positiveScore) {
      sentiment = 'negative';
      confidence = Math.min(0.8, 0.5 + (negativeScore - positiveScore) * 0.1);
    }

    return { sentiment, confidence };
  }

  // Fallback replies
  getFallbackReplies(message) {
    const lowerMessage = message?.toLowerCase() || '';
    
    if (lowerMessage.includes('thank')) {
      return ["You're welcome!", "Happy to help!", "No problem!"];
    }
    
    if (lowerMessage.includes('question') || lowerMessage.includes('help')) {
      return ["I'd be happy to help!", "What specific information do you need?", "Let me know how I can assist"];
    }

    return [
      "Thanks for your message!",
      "I'll get back to you soon",
      "Sounds good!"
    ];
  }

  // Basic message categorization (Fallback)
  getFallbackCategory(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('urgent') || lowerMessage.includes('asap') || lowerMessage.includes('emergency')) {
      return { category: 'urgent', confidence: 0.5 };
    }
    
    if (lowerMessage.includes('meeting') || lowerMessage.includes('schedule') || lowerMessage.includes('calendar')) {
      return { category: 'meeting', confidence: 0.4 };
    }
    
    if (lowerMessage.includes('project') || lowerMessage.includes('task') || lowerMessage.includes('deadline')) {
      return { category: 'work', confidence: 0.4 };
    }
    
    if (lowerMessage.includes('question') || lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return { category: 'support', confidence: 0.4 };
    }

    return { category: 'general', confidence: 0.3 };
  }

  // Extract basic action items (Fallback)
  getBasicActionItems(messages) {
    const actionItems = [];
    const actionKeywords = ['todo', 'task', 'action', 'deadline', 'due', 'complete', 'finish', 'deliver'];
    
    messages.forEach((message, index) => {
      const lowerContent = message.content.toLowerCase();
      const hasActionKeyword = actionKeywords.some(keyword => lowerContent.includes(keyword));
      
      if (hasActionKeyword) {
        actionItems.push({
          id: `action-${index}-${message.id}`,
          content: message.content,
          responsible: 'Unknown',
          priority: lowerContent.includes('urgent') ? 'high' : 'medium'
        });
      }
    });

    return actionItems;
  }
}

// Export singleton instance
export const aiService = new AIService();

