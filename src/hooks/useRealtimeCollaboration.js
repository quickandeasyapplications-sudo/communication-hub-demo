import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

/**
 * Custom hook for managing real-time collaboration via WebSocket
 * 
 * @param {string} serverUrl - The URL of the collaboration server
 * @param {string} userId - The current user's ID
 * @param {string} username - The current user's username
 * @returns {Object} - Socket instance and collaboration state
 */
export function useRealtimeCollaboration(serverUrl, userId, username) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [currentChatId, setCurrentChatId] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    if (!serverUrl || !userId || !username) return;

    // Create socket connection
    socketRef.current = io(serverUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Connection event handlers
    socketRef.current.on('connect', () => {
      console.log('Connected to collaboration server');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from collaboration server');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Collaboration event handlers
    socketRef.current.on('user-joined', (data) => {
      console.log(`User ${data.username} joined the chat`);
      setParticipants(prev => [...prev, { userId: data.userId, username: data.username, isTyping: false }]);
    });

    socketRef.current.on('user-left', (data) => {
      console.log(`User ${data.username} left the chat`);
      setParticipants(prev => prev.filter(p => p.userId !== data.userId));
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    });

    socketRef.current.on('typing-status', (data) => {
      const { userId: typingUserId, isTyping } = data;
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(typingUserId);
        } else {
          newSet.delete(typingUserId);
        }
        return newSet;
      });
    });

    socketRef.current.on('participants-list', (data) => {
      setParticipants(data.participants);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [serverUrl, userId, username]);

  // Join a chat
  const joinChat = useCallback((chatId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-chat', { chatId, userId, username });
      setCurrentChatId(chatId);
    }
  }, [isConnected, userId, username]);

  // Leave a chat
  const leaveChat = useCallback((chatId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave-chat', { chatId });
      setCurrentChatId(null);
      setParticipants([]);
      setTypingUsers(new Set());
    }
  }, [isConnected]);

  // Send a message
  const sendMessage = useCallback((chatId, message) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('send-message', {
        chatId,
        message,
        userId,
        username,
        timestamp: new Date()
      });
    }
  }, [isConnected, userId, username]);

  // Emit typing status
  const setUserTyping = useCallback((chatId, isTyping) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('user-typing', {
        chatId,
        userId,
        username,
        isTyping
      });
    }
  }, [isConnected, userId, username]);

  // Get participants in a chat
  const getParticipants = useCallback((chatId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('get-participants', { chatId });
    }
  }, [isConnected]);

  // Listen for incoming messages
  const onMessageReceived = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('receive-message', callback);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    participants,
    typingUsers,
    currentChatId,
    joinChat,
    leaveChat,
    sendMessage,
    setUserTyping,
    getParticipants,
    onMessageReceived
  };
}

