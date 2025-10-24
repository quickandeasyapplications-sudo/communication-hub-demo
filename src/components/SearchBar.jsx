import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function SearchBar({ value, onChange, placeholder = "Search..." }) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="p-4 border-b border-gray-200 bg-white">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg",
            "qet-input focus:border-[var(--qet-lime)] focus:ring-2 focus:ring-[var(--qet-lime)] focus:ring-opacity-20",
            "placeholder-gray-500 text-sm"
          )}
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

