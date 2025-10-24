import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Sparkles, Phone, Video, File, Image } from 'lucide-react';
import { formatMessageTime, cn, validateMessage } from '../lib/utils';
import { PLATFORM_CONFIG } from '../lib/types';
import { Logo } from './Logo';
import { SmartReplyPanel } from './SmartReplyPanel';
import { SentimentIndicator, ConversationSentimentTrend } from './SentimentIndicator';
import { aiService } from '../lib/aiService';
import { workflowService } from '../lib/workflowService';

export function MessageArea({ chat, messages, onSendMessage }) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSmartReplies, setShowSmartReplies] = useState(true);
  const [workflowActions, setWorkflowActions] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat changes
  useEffect(() => {
    if (chat) {
      inputRef.current?.focus();
    }
  }, [chat]);

  // Process messages through workflows
  useEffect(() => {
    if (messages.length > 0) {
      processLatestMessage();
    }
  }, [messages]);

  const processLatestMessage = async () => {
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.isOwn) return;

    try {
      // Analyze sentiment
      const sentiment = await aiService.analyzeSentiment(latestMessage.content);
      
      // Process through workflows
      const actions = await workflowService.processMessage(latestMessage, { sentiment });
      setWorkflowActions(actions);

      // Handle auto-replies
      const autoReply = actions.find(action => action.action === 'auto_reply');
      if (autoReply && autoReply.result) {
        // Simulate auto-reply after a short delay
        setTimeout(() => {
          onSendMessage(autoReply.result.message);
        }, 1000);
      }
    } catch (error) {
      console.warn('Failed to process message:', error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    const validation = validateMessage(newMessage);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    if (chat && newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
      setWorkflowActions([]); // Clear workflow actions after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Logo size="large" className="mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2 qet-brand">
            Welcome to <span className="qet-highlight">Quick and Easy Tech</span> Communication Hub
          </h2>
          <p className="text-gray-500 qet-text">
            Select a conversation to start messaging across all your platforms
          </p>
          {aiService.isAvailable() && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-blue-600">
              <Sparkles size={16} />
              <span>AI-powered features enabled</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const platformConfig = PLATFORM_CONFIG[chat.platform];

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg relative">
            {/* Added platform icon for better visual context, assuming platformConfig.icon is available */}
            {platformConfig.icon && <platformConfig.icon size={20} className="text-white" />}
            {chat.avatar}
            <div 
              className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
              style={{ backgroundColor: platformConfig.color }}
              title={platformConfig.name}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 qet-text">{chat.name}</h3>
            <div className="flex items-center space-x-2">
          {/* Added Call Buttons */}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Start voice call (Not Functional in Demo)">
            <Phone size={18} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Start video call (Not Functional in Demo)">
            <Video size={18} className="text-gray-600" />
          </button>
              <p className="text-sm text-gray-500">
                {chat.isOnline ? (
                  <span className="text-green-600">● Online</span>
                ) : (
                  `Last seen ${chat.lastSeen ? formatMessageTime(chat.lastSeen) : 'recently'}`
                )}
              </p>
              {messages.length > 2 && (
                <ConversationSentimentTrend messages={messages} />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Added Call Buttons */}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Start voice call (Not Functional in Demo)">
            <Phone size={18} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Start video call (Not Functional in Demo)">
            <Video size={18} className="text-gray-600" />
          </button>
          <div 
            className="px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: platformConfig.color }}
          >
            {platformConfig.name}
          </div>
          {aiService.isAvailable() && (
            <button
              onClick={() => setShowSmartReplies(!showSmartReplies)}
              className={cn(
                "p-2 rounded-full transition-colors",
                showSmartReplies ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
              )}
              title="Toggle smart replies"
            >
              <Sparkles size={16} />
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Workflow Actions Notification */}
      {workflowActions.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 p-2">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <Sparkles size={14} />
            <span>
              {workflowActions.length} workflow{workflowActions.length > 1 ? 's' : ''} triggered
            </span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.isOwn ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative",
                  message.isOwn
                    ? "qet-message-sent rounded-br-sm"
                    : "qet-message-received rounded-bl-sm"
                )}
              >
                {!message.isOwn && chat.isGroup && (
                  <p className="text-xs font-medium mb-1 opacity-80">
                    {message.sender}
                  </p>
                )}
                <p className="text-sm qet-text">{message.content}</p>
                {/* Added Media/Attachment Indicators */}
                {message.hasAttachment && (
                  <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                    {message.attachmentType === 'image' && <Image size={14} />}
                    {message.attachmentType === 'file' && <File size={14} />}
                    <span>{message.attachmentType === 'image' ? 'Image Attached' : 'File Attached'}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-1">
                  <p className={cn(
                    "text-xs",
                    message.isOwn ? "text-gray-700" : "text-gray-300"
                  )}>
                    {formatMessageTime(message.timestamp)}
                  </p>
                  {!message.isOwn && aiService.isAvailable() && (
                    <SentimentIndicator message={message} />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Smart Reply Panel */}
      {showSmartReplies && (
        <SmartReplyPanel
          chat={chat}
          messages={messages}
          onSendMessage={onSendMessage}
        />
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${chat.name}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none qet-input focus:border-[var(--qet-lime)] focus:ring-2 focus:ring-[var(--qet-lime)] focus:ring-opacity-20"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Attach file"
            >
              <Paperclip size={18} className="text-gray-600" />
            </button>
            
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Add emoji"
            >
              <Smile size={18} className="text-gray-600" />
            </button>
            
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={cn(
                "p-2 rounded-full transition-all duration-200",
                newMessage.trim()
                  ? "qet-button hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              )}
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


