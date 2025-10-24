import React, { useState, useEffect } from 'react';
import { Sparkles, Send, RefreshCw } from 'lucide-react';
import { aiService } from '../lib/aiService';
import { cn } from '../lib/utils';

export function SmartReplyPanel({ chat, messages, onSendMessage, className }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Generate smart replies when new messages arrive
  useEffect(() => {
    if (chat && messages.length > 0) {
      generateSmartReplies();
    }
  }, [chat, messages]);

  const generateSmartReplies = async () => {
    if (!aiService.isAvailable() || messages.length === 0) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const lastMessage = messages[messages.length - 1];
      
      // Only generate replies for incoming messages
      if (!lastMessage.isOwn) {
        const replies = await aiService.generateSmartReplies(messages, lastMessage);
        setSuggestions(replies);
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } catch (error) {
      console.warn('Failed to generate smart replies:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSendMessage(suggestion);
    setIsVisible(false);
    setSuggestions([]);
  };

  const handleRefresh = () => {
    generateSmartReplies();
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-gray-50 border-t border-gray-200 p-3", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Sparkles size={16} className="text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Smart Replies</span>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title="Refresh suggestions"
        >
          <RefreshCw size={14} className={cn("text-gray-500", isLoading && "animate-spin")} />
        </button>
      </div>
      
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="w-full text-left p-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 group-hover:text-blue-700">
                {suggestion}
              </span>
              <Send size={12} className="text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
      
      {!aiService.isAvailable() && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
          AI features are currently unavailable. Using basic suggestions.
        </div>
      )}
    </div>
  );
}

