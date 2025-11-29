'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Copy,
  Share2,
  ChevronDown,
  ChevronUp,
  Book,
  Bookmark,
  Volume2,
  Star,
  Check,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { toast } from '../ui/Toast';
import { clsx } from 'clsx';
import type { Item } from '@/types';

interface ModernPrayerCardProps {
  item: Item;
  searchTerm?: string;
  showLatin?: boolean;
  showTranslation?: boolean;
  showSource?: boolean;
  arabicFontSize?: number;
  onToggleFavorite?: (id: string) => void;
  onMoveItem?: (id: string, direction: 'up' | 'down') => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  index: number;
}

const ModernPrayerCard: React.FC<ModernPrayerCardProps> = ({
  item,
  searchTerm = '',
  showLatin = true,
  showTranslation = true,
  showSource = true,
  arabicFontSize = 28,
  onToggleFavorite,
  onMoveItem,
  canMoveUp = false,
  canMoveDown = false,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const textToCopy = [
      item.title,
      item.arabic,
      showLatin && item.latin,
      showTranslation && item.translation_id,
      showSource && item.source && `Sumber: ${item.source}`,
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Doa berhasil disalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Gagal menyalin doa');
    }
  }, [item, showLatin, showTranslation, showSource]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: `${item.title}\n\n${item.arabic}`,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          toast.error('Gagal membagikan doa');
        }
      }
    } else {
      handleCopy();
    }
  }, [item, handleCopy]);

  const highlightText = (text: string) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded">{part}</mark>
      ) : part
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      layout
    >
      <Card
        variant="glass"
        hover
        padding="none"
        rounded="2xl"
        className="overflow-hidden group"
      >
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 dark:from-emerald-400/10 dark:to-teal-600/10 rounded-xl flex items-center justify-center">
                    <Book className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {highlightText(item.title)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="primary" size="sm">
                      {item.category}
                    </Badge>
                    {item.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="default" size="xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {canMoveUp && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onMoveItem?.(item.id, 'up')}
                  className="p-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                  aria-label="Move up"
                >
                  <ArrowUp className="w-4 h-4" />
                </motion.button>
              )}
              {canMoveDown && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onMoveItem?.(item.id, 'down')}
                  className="p-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
                  aria-label="Move down"
                >
                  <ArrowDown className="w-4 h-4" />
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleFavorite?.(item.id)}
                className={clsx(
                  'p-2 transition-colors',
                  item.favorite
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
                )}
                aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={clsx('w-5 h-5', item.favorite && 'fill-current')} />
              </motion.button>
            </div>
          </div>

          {/* Kaidah (if exists and not expanded) */}
          {item.kaidah && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-3 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-200/50 dark:border-amber-800/30"
            >
              <p className="text-sm text-amber-800 dark:text-amber-300 italic">
                💡 {item.kaidah}
              </p>
            </motion.div>
          )}
        </div>

        {/* Content preview or full */}
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="p-5 space-y-5">
                {/* Kaidah (if exists) */}
                {item.kaidah && (
                  <div className="p-4 bg-gradient-to-r from-amber-50/70 to-orange-50/70 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                    <div className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                      <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                        {item.kaidah}
                      </p>
                    </div>
                  </div>
                )}

                {/* Arabic text */}
                {item.arabic && (
                  <div className="text-center">
                    <div
                      className="text-gray-900 dark:text-gray-100 leading-loose font-arabic"
                      style={{
                        fontSize: `${arabicFontSize}px`,
                        lineHeight: 2.2,
                        direction: 'rtl',
                      }}
                    >
                      {item.arabic.split('\n').map((line, idx) => (
                        <div key={idx} className="mb-4 last:mb-0">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Latin transliteration */}
                {showLatin && item.latin && (
                  <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl">
                    <p className="text-sm text-blue-900 dark:text-blue-300 italic leading-relaxed">
                      {highlightText(item.latin)}
                    </p>
                  </div>
                )}

                {/* Translation */}
                {showTranslation && item.translation_id && (
                  <div className="p-4 bg-green-50/50 dark:bg-green-900/10 rounded-xl">
                    <p className="text-sm text-green-900 dark:text-green-300 leading-relaxed">
                      {highlightText(item.translation_id)}
                    </p>
                  </div>
                )}

                {/* Source */}
                {showSource && item.source && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Book className="w-4 h-4" />
                    <span>{item.source}</span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={copied ? Check : Copy}
                    onClick={handleCopy}
                  >
                    {copied ? 'Tersalin' : 'Salin'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Share2}
                    onClick={handleShare}
                  >
                    Bagikan
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Bookmark}
                    onClick={() => toast.info('Fitur bookmark segera hadir')}
                  >
                    Simpan
                  </Button>
                  {item.audio && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Volume2}
                      onClick={() => toast.info('Fitur audio segera hadir')}
                    >
                      Dengar
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            item.arabic && (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-5 pb-3"
              >
                <p
                  className="text-gray-700 dark:text-gray-300 text-center font-arabic line-clamp-2"
                  style={{
                    fontSize: `${arabicFontSize - 4}px`,
                    direction: 'rtl',
                  }}
                >
                  {item.arabic}
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Expand/Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors border-t border-gray-200/50 dark:border-gray-700/50"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400"
          >
            <span className="text-sm font-medium">
              {isExpanded ? 'Tutup' : 'Baca Selengkapnya'}
            </span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </button>
      </Card>
    </motion.div>
  );
};

export default ModernPrayerCard;