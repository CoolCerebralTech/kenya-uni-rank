import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'line' | 'pills' | 'cards';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ 
  tabs, 
  activeTab, 
  onChange, 
  variant = 'pills',
  className = '' 
}) => {
  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950' 
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }
              `}
            >
              {tab.icon && <span className={`${isActive ? 'text-white' : 'text-slate-500'} mr-2`}>{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-2 text-xs py-0.5 px-1.5 rounded-md ${isActive ? 'bg-white/20' : 'bg-slate-800'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Line variant (Underline)
  return (
    <div className={`border-b border-slate-800 ${className}`}>
      <div className="flex -mb-px overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                ${isActive 
                  ? 'border-blue-500 text-blue-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }
              `}
            >
              {tab.icon && <span className={`mr-2 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};