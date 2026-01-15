import React from "react";
import { Link } from "react-router-dom";
import { Vote, TrendingUp, Menu, X, BarChart3, Home } from "lucide-react";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/80 dark:bg-background/80 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Area */}
        <div className="flex items-center gap-3 animate-fade-in">
          <Link to="/" className="flex items-center gap-2 group">
            {/* Logo Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                <BarChart3 size={22} strokeWidth={2.5} className="text-white" />
              </div>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="text-xl font-bold text-text dark:text-white leading-none">
                Uni<span className="text-brand-primary">Pulse</span>
              </span>
              <span className="text-[10px] text-text-subtle dark:text-text-muted leading-none tracking-wide">
                Student Voice
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {[
            { to: "/", label: "Home", icon: Home },
            { to: "/polls", label: "Polls", icon: Vote },
            { to: "/leaderboard", label: "Leaderboard", icon: TrendingUp },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-subtle dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 rounded-lg transition-all"
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Live Badge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-success/10 dark:bg-success/20 px-3 py-1.5 text-xs font-semibold text-success border border-success/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span>Live</span>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-text-subtle hover:text-brand-primary dark:hover:text-brand-primary hover:bg-brand-primary/5 rounded-lg transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white dark:bg-background px-4 py-4 animate-slide-down">
          <div className="flex flex-col gap-2">
            {[
              { to: "/", label: "Home", icon: Home },
              { to: "/polls", label: "Polls", icon: Vote },
              { to: "/leaderboard", label: "Leaderboard", icon: TrendingUp },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-4 py-3 text-text-subtle dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10 rounded-lg transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            
            {/* Mobile Live Badge */}
            <div className="flex sm:hidden items-center gap-2 mt-2 px-4 py-2 rounded-lg bg-success/10 dark:bg-success/20 text-xs font-semibold text-success border border-success/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span>Real-time updates active</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};