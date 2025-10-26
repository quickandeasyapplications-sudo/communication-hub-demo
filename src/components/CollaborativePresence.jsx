import React from 'react';
import { Users, Edit3 } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Component to display active participants and their typing status
 * 
 * @param {Array} participants - List of active participants
 * @param {Set} typingUsers - Set of user IDs currently typing
 * @param {string} className - Additional CSS classes
 */
export function CollaborativePresence({ participants = [], typingUsers = new Set(), className }) {
  if (participants.length === 0) {
    return null;
  }

  const typingUsersList = participants.filter(p => typingUsers.has(p.userId));

  return (
    <div className={cn("bg-blue-50 border-b border-blue-200 px-4 py-3", className)}>
      {/* Active Participants */}
      <div className="flex items-center space-x-2 mb-2">
        <Users size={16} className="text-blue-600" />
        <span className="text-sm font-medium text-blue-900">
          {participants.length} {participants.length === 1 ? 'participant' : 'participants'} online
        </span>
      </div>

      {/* Participant List */}
      <div className="flex flex-wrap gap-2 mb-2">
        {participants.map((participant) => (
          <div
            key={participant.userId}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              typingUsers.has(participant.userId)
                ? "bg-blue-200 text-blue-900"
                : "bg-blue-100 text-blue-800"
            )}
          >
            {participant.username}
            {typingUsers.has(participant.userId) && (
              <Edit3 size={12} className="inline ml-1" />
            )}
          </div>
        ))}
      </div>

      {/* Typing Indicator */}
      {typingUsersList.length > 0 && (
        <div className="flex items-center space-x-1 text-xs text-blue-700">
          <span className="font-medium">
            {typingUsersList.map(u => u.username).join(', ')}
            {typingUsersList.length === 1 ? ' is' : ' are'} typing
          </span>
          <div className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" />
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      )}
    </div>
  );
}

