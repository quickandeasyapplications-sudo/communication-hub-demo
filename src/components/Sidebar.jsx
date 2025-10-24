import React from 'react';
import { MessageCircle, Send, Hash, MessageSquare, Users } from 'lucide-react';
import { PLATFORMS, PLATFORM_CONFIG } from '../lib/types';
import { cn } from '../lib/utils';
import { Logo } from './Logo';
import '../App.css';

const platformIcons = {
  [PLATFORMS.WHATSAPP]: MessageCircle,
  [PLATFORMS.TELEGRAM]: Send,
  [PLATFORMS.SLACK]: Hash,
  [PLATFORMS.DISCORD]: MessageSquare,
  [PLATFORMS.TEAMS]: Users
};

export function Sidebar({ accounts, selectedPlatform, onPlatformSelect }) {
  return (
    <div className="qet-sidebar w-16 flex flex-col items-center py-4 space-y-4">
      {/* Logo */}
      <div className="mb-4">
        <Logo size="small" />
      </div>
      
      {/* Platform Buttons */}
      <div className="flex flex-col space-y-3">
        {Object.values(PLATFORMS).map((platform) => {
          const IconComponent = platformIcons[platform] || MessageCircle;
          const config = PLATFORM_CONFIG[platform];
          const account = accounts.find(acc => acc.platform === platform);
          const isSelected = selectedPlatform === platform;
          const isConnected = account?.isConnected || false;
          
          return (
            <button
              key={platform}
              onClick={() => onPlatformSelect(platform)}
              disabled={!isConnected}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                "hover:scale-110 hover:shadow-lg relative",
                isSelected 
                  ? "qet-primary shadow-lg" 
                  : isConnected
                    ? "bg-gray-600 hover:qet-accent text-white"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed",
                !isConnected && "opacity-50"
              )}
              title={`${config?.name}${isConnected ? '' : ' (Disconnected)'}`}
            >
              <IconComponent size={18} />
              {isConnected && (
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-black"
                  style={{ backgroundColor: config.color }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Add Account Button */}
      <div className="mt-auto">
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-all duration-200"
          title="Add Account"
        >
          <Users size={18} />
        </button>
      </div>
    </div>
  );
}

