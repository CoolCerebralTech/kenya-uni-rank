import React from "react";
import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-light dark:border-border bg-background-light/80 dark:bg-background/80 backdrop-blur-md shadow-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-brand-blue to-brand-pink text-white shadow-glow">
              <BarChart3 size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold text-text-inverted dark:text-white">
              UniRank<span className="text-brand-blue">KE</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { to: "/vote", label: "Vote" },
            { to: "/rankings", label: "Rankings" },
            { to: "/categories", label: "Categories" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-text-muted dark:text-gray-400 hover:text-brand-blue dark:hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success border border-success/30">
            <TrendingUp size={14} />
            <span>Live</span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-muted hover:text-brand-blue dark:hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-light dark:border-border bg-background-light dark:bg-background px-4 py-3">
          <div className="flex flex-col gap-3">
            {[
              { to: "/vote", label: "Vote" },
              { to: "/rankings", label: "Rankings" },
              { to: "/categories", label: "Categories" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-2 text-text-muted dark:text-gray-400 hover:text-brand-blue dark:hover:text-white hover:bg-background-subtle rounded-lg transition-colors"
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
