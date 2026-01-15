import React, { useEffect, useState } from 'react';
import { VotingService } from '../../services/voting';
import type { Poll } from '../../types';
import { PollCard } from './PollCard';
import { Loader2 } from 'lucide-react';

export const PollList: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const data = await VotingService.getActivePolls();
        setPolls(data);
      } catch (error) {
        console.error('Failed to load polls', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  if (polls.length === 0) {
    return (
      <div className="rounded-lg bg-background-card dark:bg-background-elevated p-8 text-center text-text-muted shadow-card animate-fade-in">
        No active polls right now. Check back later!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
};