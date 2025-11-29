'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Monitor, Sparkles, Menu } from 'lucide-react';
import Button from '../ui/Button';
import { clsx } from 'clsx';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeChange, onMenuClick }) => {
  const themeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              icon={Menu}
              onClick={onMenuClick}
              className="md:hidden"
              aria-label="Menu"
            />

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl blur-md opacity-50 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Dashboard Doa
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Kumpulan Doa Pilihan</p>
              </div>
            </motion.div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme switcher */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const nextTheme =
                    theme === 'light' ? 'dark' :
                    theme === 'dark' ? 'system' :
                    'light';
                  onThemeChange(nextTheme);
                }}
                className={clsx(
                  'p-2.5 rounded-xl transition-all duration-200',
                  'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
                  'border border-gray-200 dark:border-gray-700',
                  'shadow-sm hover:shadow-md',
                  'group'
                )}
                aria-label="Change theme"
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {React.createElement(themeIcon, {
                    className: 'w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'
                  })}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </motion.header>
  );
};

export default Header;