import React, { useState } from 'react';
import { Share2, Link, Twitter, X, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface ShareButtonProps {
  title: string;
  url?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title, url = window.location.href }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button 
        variant="secondary" 
        size="sm" 
        leftIcon={<Share2 size={16} />}
        onClick={() => setIsOpen(!isOpen)}
      >
        Share
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-white uppercase">Share Results</span>
              <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-lg hover:bg-[#1DA1F2]/20 transition-colors text-xs font-bold"
              >
                <Twitter size={14} /> Twitter
              </a>
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-2 bg-[#25D366]/10 text-[#25D366] rounded-lg hover:bg-[#25D366]/20 transition-colors text-xs font-bold"
              >
                <span className="font-sans">WA</span> WhatsApp
              </a>
            </div>

            <div className="relative">
              <input 
                readOnly 
                value={url} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pl-3 pr-10 text-xs text-slate-400 focus:outline-none"
              />
              <button 
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Link size={14} />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};