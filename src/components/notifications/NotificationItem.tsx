import React from 'react';
import { Trash2, Trophy, Vote, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export interface NotificationData {
  id: string;
  type: 'success' | 'warning' | 'info' | 'achievement';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

const icons: Record<NotificationData['type'], React.ReactNode> = {
  success: <Vote size={18} className="text-emerald-400" />,
  warning: <AlertTriangle size={18} className="text-amber-400" />,
  info: <Info size={18} className="text-blue-400" />,
  achievement: <Trophy size={18} className="text-yellow-400" />,
};

export const NotificationItem: React.FC<{
  data: NotificationData;
  onDelete: () => void;
}> = ({ data, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}
      className={`relative group flex gap-4 p-4 border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors ${!data.isRead ? 'bg-blue-950/20' : ''}`}
    >
      {!data.isRead && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />}
      
      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-800 mt-0.5">
        {icons[data.type]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className={`text-sm font-semibold truncate ${!data.isRead ? 'text-white' : 'text-slate-300'}`}>
            {data.title}
          </h4>
          <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2 mt-0.5">
            {data.timestamp}
          </span>
        </div>
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
          {data.message}
        </p>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-all self-center"
        aria-label="Delete notification"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
};