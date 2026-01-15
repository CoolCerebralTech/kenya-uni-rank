import React from 'react';
import { UniversityService } from '../../services/university';
import { ChevronRight, Loader2 } from 'lucide-react';
import type { University } from '../../types'; // Import the type

interface VoteOptionsProps {
  onVote: (universityId: string) => void;
  isVoting: boolean;
}

export const VoteOptions: React.FC<VoteOptionsProps> = ({ onVote, isVoting }) => {
  const publicUnis = UniversityService.getByType('Public');
  const privateUnis = UniversityService.getByType('Private');

  return (
    <div className="space-y-6">
      {/* Public Universities Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <h4 className="text-sm font-semibold text-gray-700">Public Universities</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {publicUnis.map((uni) => (
            <UniversityOption
              key={uni.id}
              uni={uni}
              onVote={onVote}
              isVoting={isVoting}
            />
          ))}
        </div>
      </div>

      {/* Private Universities Section */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-500"></div>
          <h4 className="text-sm font-semibold text-gray-700">Private Universities</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {privateUnis.map((uni) => (
            <UniversityOption
              key={uni.id}
              uni={uni}
              onVote={onVote}
              isVoting={isVoting}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper component for individual university option
const UniversityOption: React.FC<{
  uni: University;
  onVote: (id: string) => void;
  isVoting: boolean;
}> = ({ uni, onVote, isVoting }) => (
  <button
    onClick={() => onVote(uni.id)}
    disabled={isVoting}
    className="group relative flex w-full items-center justify-between overflow-hidden rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-all hover:border-blue-300 hover:bg-blue-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
    style={{ borderLeftColor: uni.color, borderLeftWidth: '3px' }}
  >
    <div className="flex flex-col">
      <span className="font-semibold text-gray-900">{uni.shortName}</span>
      <span className="text-xs text-gray-500">{uni.name}</span>
      <span className="text-xs text-gray-400">{uni.location}</span>
    </div>

    <div className="text-gray-400 transition-colors group-hover:text-blue-600">
      {isVoting ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        <ChevronRight size={18} />
      )}
    </div>
  </button>
);