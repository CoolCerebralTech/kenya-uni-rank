import React, { useState } from 'react';
import { Download, FileText, Image, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface ExportButtonProps {
  pollId: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ pollId }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (type: 'pdf' | 'png') => {
    setIsExporting(true);
    // Simulate generation time
    setTimeout(() => {
      setIsExporting(false);
      alert(`Exported ${pollId} as ${type.toUpperCase()}`);
    }, 2000);
  };

  return (
    <div className="relative group">
      <Button variant="ghost" size="sm" leftIcon={<Download size={16} />}>
        Export
      </Button>

      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
        
        {isExporting ? (
          <div className="flex items-center justify-center p-4 text-xs text-slate-400">
            <Loader2 size={16} className="animate-spin mr-2" /> Generating...
          </div>
        ) : (
          <>
            <button 
              onClick={() => handleExport('pdf')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-left"
            >
              <FileText size={14} className="text-red-400" /> Save as PDF
            </button>
            <button 
              onClick={() => handleExport('png')}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-left"
            >
              <Image size={14} className="text-blue-400" /> Save as Image
            </button>
          </>
        )}
      </div>
    </div>
  );
};