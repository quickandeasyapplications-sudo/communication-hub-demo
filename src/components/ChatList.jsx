import React from 'react';
import { formatMessageTime, truncateText, cn } from '../lib/utils';
import { PLATFORM_CONFIG } from '../lib/types';

export function ChatList({ chats, selectedChat, onChatSelect }) {
  if (chats.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
        <div className="text-center">
          <p className="text-sm">No conversations found</p>
          <p className="text-xs mt-1">Start a new conversation to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => {
        const isSelected = selectedChat?.id === chat.id;
        const platformConfig = PLATFORM_CONFIG[chat.platform];
        
        return (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className={cn(
              "flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors",
              isSelected && "bg-gray-100 border-l-4 qet-highlight border-l-[var(--qet-lime)]"
            )}
          >
            {/* Avatar */}
            <div className="flex-shrink-0 mr-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg relative">
                {chat.avatar}
                {/* Platform indicator */}
                <div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-xs"
                  style={{ backgroundColor: platformConfig.color }}
                  title={platformConfig.name}
                >
                  {platformConfig.icon}
                </div>
              </div>
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className={cn(
                  "font-medium text-sm truncate",
                  chat.unreadCount > 0 ? "text-black font-semibold" : "text-gray-900"
                )}>
                  {chat.name}
                </h3>
                <div className="flex items-center space-x-2">
                  {chat.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Online" />
                  )}
                  {chat.lastMessage && (
                    <span className="text-xs text-gray-500">
                      {formatMessageTime(chat.lastMessage.timestamp)}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className={cn(
                  "text-sm truncate",
                  chat.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-600"
                )}>
                  {chat.lastMessage ? (
                    <>
                      {chat.lastMessage.isOwn && (
                        <span className="text-gray-500 mr-1">You: </span>
                      )}
                      {truncateText(chat.lastMessage.content, 40)}
                    </>
                  ) : (
                    <span className="text-gray-400 italic">No messages yet</span>
                  )}
                </p>
                
                {chat.unreadCount > 0 && (
                  <div className="qet-primary text-xs px-2 py-1 rounded-full min-w-[20px] text-center font-medium">
                    {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

