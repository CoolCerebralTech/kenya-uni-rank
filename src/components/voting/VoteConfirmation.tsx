import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { University } from '../../types/models';
import { AlertTriangle } from 'lucide-react';

interface VoteConfirmationProps {
  isOpen: boolean;
  university: University | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const VoteConfirmation: React.FC<VoteConfirmationProps> = ({
  isOpen,
  university,
  onConfirm,
  onCancel,
  isSubmitting
}) => {
  if (!university) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Confirm Your Vote" size="sm">
      <div className="text-center">
        {/* Selected Uni Preview */}
        <div 
          className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white shadow-lg"
          style={{ backgroundColor: university.color }}
        >
          {university.shortName}
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Vote for {university.name}?
        </h3>
        
        <p className="text-slate-400 text-sm mb-6">
          This will lock your choice for this category. You cannot change it until the next monthly cycle.
        </p>

        <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-3 mb-6 flex items-start gap-2 text-left">
          <AlertTriangle className="text-amber-500 shrink-0" size={16} />
          <p className="text-xs text-amber-200/80">
            Please vote honestly. Our system detects and blocks spam/bot activity.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" fullWidth onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={onConfirm} 
            isLoading={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirm Vote
          </Button>
        </div>
      </div>
    </Modal>
  );
};