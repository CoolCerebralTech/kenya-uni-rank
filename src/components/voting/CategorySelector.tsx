import type { PollCategory } from '../../types/models';

interface CategorySelectorProps {
  onSelectCategory: (category: PollCategory) => void;
  completedCategories?: PollCategory[];
  currentCategory?: PollCategory;
}

const CATEGORIES = [
  {
    id: 'vibes' as PollCategory,
    emoji: '✨',
    title: 'Campus Vibes',
    description: 'Culture, lifestyle & atmosphere',
    color: '#EC4899', // Pink
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    id: 'academics' as PollCategory,
    emoji: '📚',
    title: 'Academics',
    description: 'Learning quality & programs',
    color: '#10B981', // Green
    gradient: 'from-emerald-500 to-green-500',
  },
  {
    id: 'sports' as PollCategory,
    emoji: '⚽',
    title: 'Sports & Fitness',
    description: 'Athletics & facilities',
    color: '#F59E0B', // Orange
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    id: 'social' as PollCategory,
    emoji: '🤝',
    title: 'Social Life',
    description: 'Community & networking',
    color: '#8B5CF6', // Purple
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    id: 'facilities' as PollCategory,
    emoji: '🏛️',
    title: 'Facilities',
    description: 'Infrastructure & services',
    color: '#6366F1', // Indigo
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    id: 'general' as PollCategory,
    emoji: '🎓',
    title: 'Overall Experience',
    description: 'General recommendations',
    color: '#4F46E5', // Blue
    gradient: 'from-blue-500 to-cyan-500',
  },
] as const;

export function CategorySelector({ 
  onSelectCategory, 
  completedCategories = [],
  currentCategory 
}: CategorySelectorProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-black text-white">
          Choose Your Battlefield
        </h2>
        <p className="text-slate-400">
          What matters most in your university experience?
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => {
          const isCompleted = completedCategories.includes(category.id);
          const isCurrent = currentCategory === category.id;
          const isLocked = false; // Future: lock based on prerequisites

          return (
            <button
              key={category.id}
              onClick={() => !isCompleted && onSelectCategory(category.id)}
              disabled={isCompleted || isLocked}
              className={`
                relative group overflow-hidden rounded-2xl p-6 
                transition-all duration-300 transform
                ${isCompleted 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 hover:shadow-2xl cursor-pointer'
                }
                ${isCurrent ? 'ring-4 ring-cyan-400 scale-105' : ''}
              `}
              style={{
                backgroundColor: isCompleted ? '#1E293B' : category.color + '20',
                borderWidth: '2px',
                borderColor: isCompleted ? '#475569' : category.color + '60',
              }}
            >
              {/* Background Gradient */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10 space-y-4">
                {/* Icon & Status */}
                <div className="flex items-start justify-between">
                  <div className="text-5xl transform group-hover:scale-110 transition-transform duration-300">
                    {category.emoji}
                  </div>
                  
                  {isCompleted && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
                      <span className="text-xs font-bold text-green-400">✓ CONQUERED</span>
                    </div>
                  )}
                  
                  {isCurrent && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 rounded-full animate-pulse">
                      <span className="text-xs font-bold text-cyan-400">• ACTIVE</span>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {category.description}
                  </p>
                </div>

                {/* Action Indicator */}
                {!isCompleted && !isLocked && (
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span 
                      className="group-hover:text-white transition-colors"
                      style={{ color: category.color }}
                    >
                      Enter Arena →
                    </span>
                  </div>
                )}

                {isLocked && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>🔒 Locked</span>
                  </div>
                )}
              </div>

              {/* Glow Effect on Hover */}
              {!isCompleted && (
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `inset 0 0 40px ${category.color}40`,
                  }}
                />
              )}

              {/* Completion Checkmark Overlay */}
              {isCompleted && (
                <div className="absolute top-2 right-2 text-3xl">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-300">
            Progress
          </span>
          <span className="text-sm text-slate-400">
            {completedCategories.length} / {CATEGORIES.length} categories
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ 
              width: `${(completedCategories.length / CATEGORIES.length) * 100}%` 
            }}
          />
        </div>
      </div>
    </div>
  );
}