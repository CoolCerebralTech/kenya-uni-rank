import React from 'react';
import { Trash2, Trophy, Vote, AlertTriangle, Info } from 'lucide-react';

export interface NotificationData {
  id: string;
  type: 'success' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

interface NotificationItemProps {
  data: NotificationData;
  onDelete: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ data, onDelete }) => {
  const icons = {
    success: <Vote size={16} className="text-green-400" />,
    warning: <AlertTriangle size={16} className="text-amber-400" />,
    info: <Info size={16} className="text-blue-400" />,
    achievement: <Trophy size={16} className="text-yellow-400" />,
  };

  return (
    <div className={`
      relative group flex gap-3 p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors
      ${!data.isRead ? 'bg-slate-800/10' : ''}
    `}>
      {/* Unread Indicator */}
      {!data.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />
      )}

      {/* Icon */}
      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700`}>
        {icons[data.type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <h4 className={`text-sm font-semibold truncate ${!data.isRead ? 'text-white' : 'text-slate-300'}`}>
            {data.title}
          </h4>
          <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
            {data.timestamp}
          </span>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {data.message}
        </p>
      </div>

      {/* Actions */}
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all self-center"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};