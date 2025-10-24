import React, { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './components/ui/resizable';
import { EnhancedSidebar } from './components/EnhancedSidebar';
import { ChatList } from './components/ChatList';
import { MessageArea } from './components/MessageArea';
import { SearchBar } from './components/SearchBar';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { TaskManager } from './components/TaskManager';
import { useMockData } from './hooks/useMockData';
import { PLATFORMS } from './lib/types';
import { searchItems, sortChatsByLastMessage } from './lib/utils';
import './App.css';

function App() {
  const { chats, messages, accounts, sendMessage } = useMockData();
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedView, setSelectedView] = useState('chats');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats based on platform and search
  const filteredChats = chats.filter(chat => {
    const matchesPlatform = selectedPlatform === 'all' || chat.platform === selectedPlatform;
    const matchesSearch = !searchQuery || 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesPlatform && matchesSearch;
  });

  // Sort chats by last message
  const sortedChats = sortChatsByLastMessage(filteredChats);

  // Filter messages for selected chat
  const chatMessages = selectedChat 
    ? messages.filter(msg => msg.chatId === selectedChat.id)
    : [];

  const handleSendMessage = (content) => {
    if (selectedChat) {
      sendMessage(selectedChat.id, selectedChat.platform, content);
    }
  };

  const renderMainContent = () => {
    switch (selectedView) {
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'tasks':
        return <TaskManager />;
      case 'unread':
        const unreadChats = sortedChats.filter(chat => chat.unreadCount > 0);
        return (
          <ResizablePanelGroup direction="horizontal" className="flex h-full">
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="border-r border-gray-200">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <ChatList
                chats={unreadChats}
                selectedChat={selectedChat}
                onChatSelect={setSelectedChat}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} minSize={50}>
              <MessageArea
              chat={selectedChat}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        );
      case 'starred':
        const starredChats = sortedChats.filter(chat => chat.isStarred);
        return (
          <ResizablePanelGroup direction="horizontal" className="flex h-full">
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="border-r border-gray-200">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <ChatList
                chats={starredChats}
                selectedChat={selectedChat}
                onChatSelect={setSelectedChat}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} minSize={50}>
              <MessageArea
              chat={selectedChat}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        );
      case 'archived':
        const archivedChats = sortedChats.filter(chat => chat.isArchived);
        return (
          <ResizablePanelGroup direction="horizontal" className="flex h-full">
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="border-r border-gray-200">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <ChatList
                chats={archivedChats}
                selectedChat={selectedChat}
                onChatSelect={setSelectedChat}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} minSize={50}>
              <MessageArea
              chat={selectedChat}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        );
      case 'teams':
        const teamChats = sortedChats.filter(chat => chat.isGroup);
        return (
          <ResizablePanelGroup direction="horizontal" className="flex h-full">
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="border-r border-gray-200">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <ChatList
                chats={teamChats}
                selectedChat={selectedChat}
                onChatSelect={setSelectedChat}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} minSize={50}>
              <MessageArea
              chat={selectedChat}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        );
      default: // 'chats'
        return (
          <ResizablePanelGroup direction="horizontal" className="flex h-full">
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="border-r border-gray-200">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
              <ChatList
                chats={sortedChats}
                selectedChat={selectedChat}
                onChatSelect={setSelectedChat}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={70} minSize={50}>
              <MessageArea
              chat={selectedChat}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-50 qet-text">
      <ResizablePanelGroup direction="horizontal" className="h-screen max-h-screen">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <EnhancedSidebar
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        selectedView={selectedView}
        onViewChange={setSelectedView}
      />
      
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={80} minSize={50}>
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderMainContent()}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

export default App;

