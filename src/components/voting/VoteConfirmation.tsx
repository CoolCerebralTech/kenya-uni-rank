import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { University } from '../../types/models';
import { AlertTriangle, ShieldCheck, Check } from 'lucide-react';

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
      <div className="text-center space-y-5">
        {/* Hero uni mark */}
        <div className="relative inline-flex">
          <div
            className="absolute -inset-3 rounded-full opacity-50 blur-xl"
            style={{ backgroundColor: university.color }}
            aria-hidden
          />
          <div
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-2xl"
            style={{ backgroundColor: university.color }}
          >
            {university.shortName}
          </div>
        </div>

        {/* Headline */}
        <div>
          <h3 className="text-xl font-bold text-white mb-1">
            Vote for {university.name}?
          </h3>
          <p className="text-slate-400 text-sm">
            Your vote is final until the next monthly cycle.
          </p>
        </div>

        {/* Why-it-matters card */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-start gap-3 text-left">
          <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={16} />
          <p className="text-xs text-amber-200/80 leading-relaxed">
            Vote honestly. Our system detects and blocks spam and bot activity using browser fingerprinting.
          </p>
        </div>

        {/* Privacy line */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck size={12} />
          <span>Anonymous, no signup, no tracking.</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <Button variant="ghost" fullWidth onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="success"
            fullWidth
            onClick={onConfirm}
            isLoading={isSubmitting}
            leftIcon={!isSubmitting ? <Check size={16} /> : undefined}
          >
            Confirm Vote
          </Button>
        </div>
      </div>
    </Modal>
  );
};
