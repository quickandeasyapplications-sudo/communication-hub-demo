import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format timestamp for display
export function formatMessageTime(timestamp) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Yesterday';
  } else {
    return format(date, 'MMM dd');
  }
}

// Format last seen time
export function formatLastSeen(timestamp) {
  if (!timestamp) return 'Never';
  
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return `Today at ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'HH:mm')}`;
  } else {
    return formatDistanceToNow(date, { addSuffix: true });
  }
}

// Generate unique ID
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Truncate text with ellipsis
export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Search function for messages and chats
export function searchItems(items, query, searchFields = ['name', 'content']) {
  if (!query) return items;
  
  const lowercaseQuery = query.toLowerCase();
  
  return items.filter(item => {
    return searchFields.some(field => {
      const value = getNestedValue(item, field);
      return value && value.toLowerCase().includes(lowercaseQuery);
    });
  });
}

// Get nested object value by path
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Debounce function for search
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Sort chats by last message timestamp
export function sortChatsByLastMessage(chats) {
  return [...chats].sort((a, b) => {
    const aTime = a.lastMessage?.timestamp || 0;
    const bTime = b.lastMessage?.timestamp || 0;
    return new Date(bTime) - new Date(aTime);
  });
}

// Get platform color
export function getPlatformColor(platform) {
  const colors = {
    whatsapp: '#25D366',
    telegram: '#0088CC',
    slack: '#4A154B',
    discord: '#5865F2',
    teams: '#6264A7'
  };
  return colors[platform] || '#555555';
}

// Validate message content
export function validateMessage(content) {
  if (!content || typeof content !== 'string') {
    return { isValid: false, error: 'Message content is required' };
  }
  
  if (content.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (content.length > 4000) {
    return { isValid: false, error: 'Message is too long (max 4000 characters)' };
  }
  
  return { isValid: true };
}

// Format file size
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
