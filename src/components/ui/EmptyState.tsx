import React from 'react';
import { SearchX, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Data Found",
  description = "Our scanners couldn't find any results in this sector.",
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-slate-900/50 p-4 rounded-full border border-slate-800 mb-4">
        {icon || <SearchX className="h-8 w-8 text-slate-500" />}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button 
          variant="secondary" 
          onClick={onAction}
          leftIcon={<RefreshCcw size={16} />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};