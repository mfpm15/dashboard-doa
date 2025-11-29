'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import * as Tabs from '@radix-ui/react-tabs';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  itemCounts?: Record<string, number>;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  itemCounts = {},
}) => {
  return (
    <Tabs.Root value={activeCategory} onValueChange={onCategoryChange}>
      <Tabs.List className="flex items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <Tabs.Trigger
            key={category}
            value={category}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={clsx(
                'relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap',
                'hover:bg-white/50 dark:hover:bg-gray-700/50',
                activeCategory === category
                  ? 'text-white'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              {activeCategory === category && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {category}
                {itemCounts[category] !== undefined && (
                  <span
                    className={clsx(
                      'px-1.5 py-0.5 text-xs rounded-full',
                      activeCategory === category
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    )}
                  >
                    {itemCounts[category]}
                  </span>
                )}
              </span>
            </motion.div>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
};

export default CategoryTabs;