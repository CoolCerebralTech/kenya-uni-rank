
import { Bell, CheckCheck } from 'lucide-react';
import { NotificationItem, type NotificationData } from './NotificationItem';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnClickOutside } from '../../hooks/useUtilities';
import { useRef, useState } from 'react';

export const NotificationBell: React.FC<{
  notifications: NotificationData[];
  onMarkAllRead: () => void;
  onDelete: (id: string) => void;
}> = ({ notifications, onMarkAllRead, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-full transition-colors ${isOpen ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
      >
        <Bell size={20} className={unreadCount > 0 ? 'animate-wiggle' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 border border-slate-950"></span>
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-bold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={onMarkAllRead} className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium">
                  <CheckCheck size={14} /> Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((n) => <NotificationItem key={n.id} data={n} onDelete={() => onDelete(n.id)} />)
              ) : (
                <div className="py-12 text-center text-slate-500">
                  <Bell size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">You're all caught up!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};