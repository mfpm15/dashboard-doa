import React from 'react';

/**
 * Escape special regex characters to prevent regex errors
 */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Highlight search term in text
 */
export function createHighlightText(searchTerm: string) {
  return function highlightText(text: string): React.ReactNode {
    if (!searchTerm || !text) return text;

    // Escape special regex characters
    const escapedTerm = escapeRegExp(searchTerm);
    const parts = text.split(new RegExp(`(${escapedTerm})`, 'gi'));

    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };
}

/**
 * Render formatted text with markdown support
 */
export function createRenderFormattedText(highlightText: (text: string) => React.ReactNode) {
  return function renderFormattedText(text: string): React.ReactNode {
    if (!text) return null;

    const processInlineMarkdown = (str: string) => {
      const elements: React.ReactNode[] = [];
      let lastIndex = 0;

      // Combined regex to capture both bold (**text**) and italic (*text*) patterns
      const regex = /\*\*([^*]+?)\*\*|\*([^*]+?)\*/g;
      let match;

      while ((match = regex.exec(str)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          const beforeText = str.substring(lastIndex, match.index);
          elements.push(<span key={`text-${lastIndex}`}>{highlightText(beforeText)}</span>);
        }

        // Add the formatted text
        if (match[1]) {
          // Bold text (captured by first group)
          elements.push(
            <strong key={`bold-${match.index}`} className="font-bold text-slate-900 dark:text-slate-100">
              {match[1]}
            </strong>
          );
        } else if (match[2]) {
          // Italic text (captured by second group)
          elements.push(
            <em key={`italic-${match.index}`} className="font-medium italic text-slate-800 dark:text-slate-200">
              {match[2]}
            </em>
          );
        }

        lastIndex = match.index + match[0].length;
      }

      // Add any remaining text
      if (lastIndex < str.length) {
        const remainingText = str.substring(lastIndex);
        elements.push(<span key={`text-${lastIndex}`}>{highlightText(remainingText)}</span>);
      }

      return elements.length > 0 ? elements : highlightText(str);
    };

    const lines = text.split('\n');
    return lines.map((line, lineIndex) => {
      const trimmed = line.trim();

      // Check for headings
      if (trimmed.startsWith('###')) {
        return (
          <h4
            key={lineIndex}
            className="text-lg font-bold mt-6 mb-3 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2"
          >
            {trimmed.replace(/^###\s*/, '')}
          </h4>
        );
      }
      if (trimmed.startsWith('##')) {
        return (
          <h3 key={lineIndex} className="text-xl font-bold mt-8 mb-4 text-slate-900 dark:text-slate-100">
            {trimmed.replace(/^##\s*/, '')}
          </h3>
        );
      }
      if (trimmed === '---') {
        return <hr key={lineIndex} className="my-8 border-t border-gray-200 dark:border-gray-700" />;
      }

      // Check for bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const content = trimmed.substring(2);
        return (
          <div key={lineIndex} className="flex items-start gap-3 mb-2 pl-2">
            <span className="text-emerald-500 mt-1.5 text-lg">•</span>
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
              {processInlineMarkdown(content)}
            </div>
          </div>
        );
      }

      // Detect Arabic line (heuristic: > 40% Arabic characters)
      const arabicPattern = /[\u0600-\u06FF]/;
      if (arabicPattern.test(trimmed)) {
        const arabicChars = (trimmed.match(/[\u0600-\u06FF]/g) || []).length;
        const totalChars = trimmed.replace(/\s/g, '').length;

        if (totalChars > 0 && arabicChars / totalChars > 0.4) {
          return (
            <div
              key={lineIndex}
              className="my-6 px-4 py-2 rounded-lg border-r-4 border-emerald-400 bg-gray-50/50 dark:bg-gray-800/50"
              dir="rtl"
            >
              <p className="font-arabic text-2xl sm:text-3xl text-slate-800 dark:text-slate-200 leading-loose text-right">
                {trimmed}
              </p>
            </div>
          );
        }
      }

      const processedContent = processInlineMarkdown(line);

      return (
        <div
          key={lineIndex}
          className={trimmed ? 'mb-3 leading-relaxed text-gray-700 dark:text-gray-300' : 'mb-3'}
        >
          {processedContent}
        </div>
      );
    });
  };
}
