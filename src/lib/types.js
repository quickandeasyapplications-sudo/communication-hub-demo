// Data types and models for the Communication Hub

export const PLATFORMS = {
  WHATSAPP: 'whatsapp',
  TELEGRAM: 'telegram',
  SLACK: 'slack',
  DISCORD: 'discord',
  TEAMS: 'teams'
};

export const PLATFORM_CONFIG = {
  [PLATFORMS.WHATSAPP]: {
    name: 'WhatsApp',
    color: '#25D366',
    icon: '📱'
  },
  [PLATFORMS.TELEGRAM]: {
    name: 'Telegram',
    color: '#0088CC',
    icon: '✈️'
  },
  [PLATFORMS.SLACK]: {
    name: 'Slack',
    color: '#4A154B',
    icon: '💬'
  },
  [PLATFORMS.DISCORD]: {
    name: 'Discord',
    color: '#5865F2',
    icon: '🎮'
  },
  [PLATFORMS.TEAMS]: {
    name: 'Microsoft Teams',
    color: '#6264A7',
    icon: '👥'
  }
};

export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  VOICE: 'voice',
  VIDEO: 'video'
};

export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed'
};

// Message data structure
export class Message {
  constructor({
    id,
    chatId,
    platform,
    content,
    type = MESSAGE_TYPES.TEXT,
    sender,
    timestamp,
    status = MESSAGE_STATUS.SENT,
    isOwn = false,
    metadata = {}
  }) {
    this.id = id;
    this.chatId = chatId;
    this.platform = platform;
    this.content = content;
    this.type = type;
    this.sender = sender;
    this.timestamp = timestamp;
    this.status = status;
    this.isOwn = isOwn;
    this.metadata = metadata;
  }
}

// Chat data structure
export class Chat {
  constructor({
    id,
    platform,
    name,
    avatar,
    lastMessage,
    unreadCount = 0,
    isGroup = false,
    participants = [],
    isOnline = false,
    lastSeen
  }) {
    this.id = id;
    this.platform = platform;
    this.name = name;
    this.avatar = avatar;
    this.lastMessage = lastMessage;
    this.unreadCount = unreadCount;
    this.isGroup = isGroup;
    this.participants = participants;
    this.isOnline = isOnline;
    this.lastSeen = lastSeen;
  }
}

// Platform Account data structure
export class PlatformAccount {
  constructor({
    platform,
    username,
    displayName,
    avatar,
    isConnected = false,
    lastSync
  }) {
    this.platform = platform;
    this.username = username;
    this.displayName = displayName;
    this.avatar = avatar;
    this.isConnected = isConnected;
    this.lastSync = lastSync;
  }
}

