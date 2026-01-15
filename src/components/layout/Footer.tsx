import React from "react";
import { Link } from "react-router-dom";
import { Heart, Github, Twitter, Mail } from "lucide-react";

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background-light dark:bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left - Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary">
                <span className="text-white font-bold text-sm">UP</span>
              </div>
              <span className="text-lg font-bold text-text dark:text-white">
                Uni<span className="text-brand-primary">Pulse</span>
              </span>
            </div>
            <p className="text-sm text-text-subtle dark:text-gray-400 max-w-xs">
              The pulse of Kenyan universities. Real student opinions, real-time results.
            </p>
            <div className="flex items-center gap-2 text-xs text-text-muted dark:text-gray-500">
              <span>Made with</span>
              <Heart size={12} className="text-danger fill-danger animate-pulse" />
              <span>for students</span>
            </div>
          </div>

          {/* Center - Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text dark:text-white uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/polls", label: "Browse Polls" },
                { to: "/leaderboard", label: "University Rankings" },
                { to: "/about", label: "About Us" },
                { to: "/feedback", label: "Send Feedback" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-text-subtle dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Connect & Disclaimer */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text dark:text-white uppercase tracking-wide">
              Connect
            </h3>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Mail, href: "mailto:hello@unipulse.ke", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-background-subtle dark:bg-background-elevated hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 text-text-subtle dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-primary transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
            
            {/* Disclaimer */}
            <div className="mt-4 p-3 rounded-lg bg-info/5 dark:bg-info/10 border border-info/20">
              <p className="text-xs text-text-subtle dark:text-gray-400">
                <strong className="text-info font-semibold">Note:</strong> Rankings reflect student sentiment and are updated in real-time. Not official university standings.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-muted dark:text-gray-500 text-center sm:text-left">
            &copy; {year} UniPulse. All rights reserved. Data updates every second.
          </p>
          <div className="flex gap-4 text-xs">
            <Link
              to="/privacy"
              className="text-text-subtle dark:text-gray-400 hover:text-brand-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-text-subtle dark:text-gray-400 hover:text-brand-primary transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};