import React from "react";

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border-light dark:border-border bg-background-light dark:bg-background py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left side - Added subtle animation and brand color accents */}
          <div className="animate-fade-in">
            <p className="text-sm text-text-muted dark:text-gray-400">
              Built with ❤️ for Kenyan Students.
            </p>
            <p className="text-xs text-text-subtle dark:text-gray-500 mt-1">
              &copy; {year} UniRank KE. All data updates in real-time.
            </p>
          </div>

          {/* Disclaimer - Enhanced with glow shadow and better readability */}
          <div className="max-w-md text-xs bg-brand-blue/5 dark:bg-background-subtle rounded-lg p-4 border border-brand-blue/20 shadow-glow-blue">
            <strong className="text-brand-blue dark:text-brand-blue">Disclaimer:</strong>{" "}
            University data is sourced from student votes and public records. Rankings are generated
            by community sentiment and do not represent official standings.
          </div>
        </div>
      </div>
    </footer>
  );
};