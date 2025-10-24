import { useState, useEffect } from 'react';
import { Message, Chat, PlatformAccount, PLATFORMS, MESSAGE_TYPES } from '../lib/types';
import { generateId } from '../lib/utils';

// Mock data for demonstration purposes
export function useMockData() {
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      initializeMockData();
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const initializeMockData = () => {
    // Mock platform accounts
    const mockAccounts = [
      new PlatformAccount({
        platform: PLATFORMS.WHATSAPP,
        username: '+1234567890',
        displayName: 'John Doe',
        isConnected: true
      }),
      new PlatformAccount({
        platform: PLATFORMS.TELEGRAM,
        username: '@johndoe',
        displayName: 'John Doe',
        isConnected: true
      }),
      new PlatformAccount({
        platform: PLATFORMS.SLACK,
        username: 'john.doe@company.com',
        displayName: 'John Doe',
        isConnected: true
      }),
      new PlatformAccount({
        platform: PLATFORMS.DISCORD,
        username: 'JohnDoe#1234',
        displayName: 'John Doe',
        isConnected: false
      }),
      new PlatformAccount({
        platform: PLATFORMS.TEAMS,
        username: 'john.doe@company.com',
        displayName: 'John Doe',
        isConnected: true
      })
    ];

    // Mock chats
    const mockChats = [
      new Chat({
        id: 'chat-001',
        platform: PLATFORMS.WHATSAPP,
        name: 'Alice Johnson',
        avatar: '👩‍💼',
        unreadCount: 3,
        isGroup: false,
        participants: ['alice.johnson'],
        isOnline: true
      }),
      new Chat({
        id: 'chat-002',
        platform: PLATFORMS.TELEGRAM,
        name: 'Project Team',
        avatar: '👥',
        unreadCount: 1,
        isGroup: true,
        participants: ['bob.smith', 'carol.white', 'dave.brown'],
        isOnline: false
      }),
      new Chat({
        id: 'chat-003',
        platform: PLATFORMS.SLACK,
        name: '#general',
        avatar: '💬',
        unreadCount: 0,
        isGroup: true,
        participants: ['team-members'],
        isOnline: false
      }),
      new Chat({
        id: 'chat-004',
        platform: PLATFORMS.WHATSAPP,
        name: 'Family Group',
        avatar: '👨‍👩‍👧‍👦',
        unreadCount: 5,
        isGroup: true,
        participants: ['mom', 'dad', 'sister'],
        isOnline: false
      }),
      new Chat({
        id: 'chat-005',
        platform: PLATFORMS.TELEGRAM,
        name: 'Emma Wilson',
        avatar: '👩‍🎨',
        unreadCount: 0,
        isGroup: false,
        participants: ['emma.wilson'],
        isOnline: true
      }),
      new Chat({
        id: 'chat-006',
        platform: PLATFORMS.DISCORD,
        name: 'Gaming Squad',
        avatar: '🎮',
        unreadCount: 2,
        isGroup: true,
        participants: ['player1', 'player2', 'player3'],
        isOnline: true
      }),
      new Chat({
        id: 'chat-007',
        platform: PLATFORMS.TEAMS,
        name: 'Marketing Team',
        avatar: '📈',
        unreadCount: 1,
        isGroup: true,
        participants: ['marketing-team'],
        isOnline: false
      })
    ];

    // Mock messages
    const mockMessages = [
      new Message({
        id: generateId(),
        chatId: 'chat-001',
        platform: PLATFORMS.WHATSAPP,
        content: 'Hey! How are you doing today?',
        type: MESSAGE_TYPES.TEXT,
        sender: 'Alice Johnson',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isOwn: false
      }),
      new Message({
        id: generateId(),
        chatId: 'chat-001',
        platform: PLATFORMS.WHATSAPP,
        content: 'Hi Alice! I\'m doing great, thanks for asking. How about you?',
        type: MESSAGE_TYPES.TEXT,
        sender: 'You',
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        isOwn: true
      }),
      new Message({
        id: generateId(),
        chatId: 'chat-001',
        platform: PLATFORMS.WHATSAPP,
        content: 'I\'m good! Are we still on for the meeting tomorrow?',
        type: MESSAGE_TYPES.TEXT,
        sender: 'Alice Johnson',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        isOwn: false
      }),
      new Message({
        id: generateId(),
        chatId: 'chat-002',
        platform: PLATFORMS.TELEGRAM,
        content: 'The new feature is ready for testing. Please check it out when you have time.',
        type: MESSAGE_TYPES.TEXT,
        sender: 'Bob Smith',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        isOwn: false
      }),
      new Message({
        id: generateId(),
        chatId: 'chat-003',
        platform: PLATFORMS.SLACK,
        content: 'Great job on the presentation today everyone! 🎉',
        type: MESSAGE_TYPES.TEXT,
        sender: 'Carol White',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        isOwn: false
      }),
      new Message({
        id: generateId(),
        chatId: 'chat-004',
        platform: PLATFORMS.WHATSAPP,
        content: 'Don\'t forget about dinner this Sunday!',
        type: MESSAGE_TYPES.TEXT,
        sender: 'Mom',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        isOwn: false
      }),
      new Message({
        id: generateId(),
        chatId: 'chat-004',
        platform: PLATFORMS.WHATSAPP,
        content: 'Looking forward to it! Should I bring anything?',
        type: MESSAGE_TYPES.TEXT,
        sender: 'Dad',
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        isOwn: false
      }),
      new Message({
        id: generateId(),
        chatId: 'chat-005',
        platform: PLATFORMS.TELEGRAM,
        content: 'Thanks for the help with the project! Really appreciate it.',
        type: MESSAGE_TYPES.TEXT,
        sender: 'Emma Wilson',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        isOwn: false
      }),
      new Message({
        id: generateId(),
        chatId: 'chat-006',
        platform: PLATFORMS.DISCORD,
        content: 'Anyone up for a game tonight?',
        type: MESSAGE_TYPES.TEXT,
        sender: 'Player1',
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        isOwn: false
      }),
      new Message({
        id: generateId(),
        chatId: 'chat-007',
        platform: PLATFORMS.TEAMS,
        content: 'The Q4 campaign results are looking great!',
        type: MESSAGE_TYPES.TEXT,
        sender: 'Marketing Lead',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        isOwn: false
      })
    ];

    // Update chats with last messages
    mockChats.forEach(chat => {
      const chatMessages = mockMessages.filter(msg => msg.chatId === chat.id);
      if (chatMessages.length > 0) {
        const lastMessage = chatMessages.reduce((latest, current) => 
          new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
        );
        chat.lastMessage = lastMessage;
      }
    });

    setAccounts(mockAccounts);
    setChats(mockChats);
    setMessages(mockMessages);
  };

  const sendMessage = (chatId, platform, content, type = MESSAGE_TYPES.TEXT) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const newMessage = new Message({
      id: generateId(),
      chatId: chatId,
      platform: platform,
      content: content,
      type: type,
      sender: 'You',
      timestamp: new Date().toISOString(),
      isOwn: true
    });

    setMessages(prev => [...prev, newMessage]);
    
    // Update chat's last message
    setChats(prev => prev.map(c => 
      c.id === chatId ? { ...c, lastMessage: newMessage } : c
    ));
  };

  const markAsRead = (chatId) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ));
  };

  return {
    messages,
    chats,
    accounts,
    loading,
    sendMessage,
    markAsRead
  };
}

