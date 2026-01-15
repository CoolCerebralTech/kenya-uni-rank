import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border bg-background-light/80 dark:bg-background/80 backdrop-blur-md shadow-glow"> {/* Enhanced shadow to glow */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Area - Added scale-in animation and hover effects */}
        <div className="flex items-center gap-2 animate-scale-in">
          <Link to="/" className="flex items-center gap-2 group"> {/* Group for hover */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-brand-blue to-brand-pink text-white shadow-glow-blue transition-all group-hover:shadow-glow group-hover:scale-110">
              <BarChart3 size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold text-text-inverted dark:text-white transition-colors group-hover:text-brand-blue">
              UniRank<span className="text-brand-blue">KE</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Added hover glow and transitions */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { to: "/vote", label: "Vote" },
            { to: "/rankings", label: "Rankings" },
            { to: "/categories", label: "Categories" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-text-muted dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors hover:shadow-glow-blue px-3 py-1 rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side - Enhanced live badge with pulse animation */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success border border-success/30 animate-pulse">
            <TrendingUp size={14} />
            <span>Live</span>
          </div>

          {/* Mobile menu button - Added better transitions */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-muted hover:text-brand-blue dark:hover:text-brand-blue transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu - Added slide-up animation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-light dark:border-border bg-background-light dark:bg-background px-4 py-3 animate-slide-up">
          <div className="flex flex-col gap-3">
            {[
              { to: "/vote", label: "Vote" },
              { to: "/rankings", label: "Rankings" },
              { to: "/categories", label: "Categories" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 text-text-muted dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue hover:bg-background-hover rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};