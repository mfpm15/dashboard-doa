import { Item } from '@/types';

export interface PerformanceMetrics {
  renderTime: number;
  searchTime: number;
  loadTime: number;
  memoryUsage: number;
  itemsPerSecond: number;
  timestamp: number;
}

export interface OptimizationSettings {
  enableVirtualization: boolean;
  chunkSize: number;
  debounceDelay: number;
  cacheSize: number;
  preloadItems: number;
  enableCompression: boolean;
  enableLazyLoading: boolean;
}

export class PerformanceOptimizer {
  private metrics: PerformanceMetrics[] = [];
  private settings: OptimizationSettings;
  private cache: Map<string, any> = new Map();
  private renderObserver: PerformanceObserver | null = null;
  private memoryThreshold = 100 * 1024 * 1024; // 100MB

  constructor() {
    this.settings = this.loadSettings();
    this.initializePerformanceMonitoring();
    this.startMemoryMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    try {
      // Monitor rendering performance
      this.renderObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'measure') {
            this.recordMetric({
              renderTime: entry.duration,
              searchTime: 0,
              loadTime: 0,
              memoryUsage: this.getMemoryUsage(),
              itemsPerSecond: 0,
              timestamp: Date.now()
            });
          }
        }
      });

      this.renderObserver.observe({ entryTypes: ['measure'] });
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }

  /**
   * Monitor memory usage
   */
  private startMemoryMonitoring(): void {
    if (typeof window === 'undefined') return;

    setInterval(() => {
      const memoryUsage = this.getMemoryUsage();
      if (memoryUsage > this.memoryThreshold) {
        this.performMemoryCleanup();
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Get current memory usage
   */
  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in window.performance) {
      return (window.performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  /**
   * Optimize item rendering with virtualization
   */
  optimizeItemRendering<T>(
    items: T[],
    containerHeight: number,
    itemHeight: number,
    scrollTop: number
  ): { visibleItems: T[]; totalHeight: number; offsetY: number } {
    if (!this.settings.enableVirtualization) {
      return {
        visibleItems: items,
        totalHeight: items.length * itemHeight,
        offsetY: 0
      };
    }

    const totalHeight = items.length * itemHeight;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + this.settings.preloadItems, items.length);
    const bufferedStartIndex = Math.max(0, startIndex - this.settings.preloadItems);

    const visibleItems = items.slice(bufferedStartIndex, endIndex);
    const offsetY = bufferedStartIndex * itemHeight;

    return { visibleItems, totalHeight, offsetY };
  }

  /**
   * Optimize search with debouncing and caching
   */
  optimizeSearch<T>(
    query: string,
    items: T[],
    searchFn: (query: string, items: T[]) => T[]
  ): Promise<T[]> {
    return new Promise((resolve) => {
      const cacheKey = `search_${query}`;

      // Check cache first
      if (this.cache.has(cacheKey)) {
        resolve(this.cache.get(cacheKey));
        return;
      }

      // Debounce search
      const startTime = performance.now();

      setTimeout(() => {
        const results = searchFn(query, items);
        const endTime = performance.now();

        // Cache results
        this.setCacheItem(cacheKey, results);

        // Record metrics
        this.recordMetric({
          renderTime: 0,
          searchTime: endTime - startTime,
          loadTime: 0,
          memoryUsage: this.getMemoryUsage(),
          itemsPerSecond: results.length / ((endTime - startTime) / 1000),
          timestamp: Date.now()
        });

        resolve(results);
      }, this.settings.debounceDelay);
    });
  }

  /**
   * Optimize data loading with chunking
   */
  optimizeDataLoading<T>(
    data: T[],
    processor: (chunk: T[]) => Promise<T[]>
  ): Promise<T[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const startTime = performance.now();
        const chunks = this.chunkArray(data, this.settings.chunkSize);
        const results: T[] = [];

        for (const chunk of chunks) {
          const processedChunk = await processor(chunk);
          results.push(...processedChunk);

          // Yield to browser between chunks
          await new Promise(r => setTimeout(r, 0));
        }

        const endTime = performance.now();
        this.recordMetric({
          renderTime: 0,
          searchTime: 0,
          loadTime: endTime - startTime,
          memoryUsage: this.getMemoryUsage(),
          itemsPerSecond: results.length / ((endTime - startTime) / 1000),
          timestamp: Date.now()
        });

        resolve(results);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Compress data for storage
   */
  compressData(data: any): string {
    if (!this.settings.enableCompression) {
      return JSON.stringify(data);
    }

    try {
      // Simple compression using LZ-string-like algorithm
      const jsonStr = JSON.stringify(data);
      return this.compress(jsonStr);
    } catch (error) {
      console.warn('Compression failed, using uncompressed data:', error);
      return JSON.stringify(data);
    }
  }

  /**
   * Decompress data from storage
   */
  decompressData(compressedData: string): any {
    try {
      if (!this.settings.enableCompression) {
        return JSON.parse(compressedData);
      }

      const decompressed = this.decompress(compressedData);
      return JSON.parse(decompressed);
    } catch (error) {
      // Fallback to regular JSON parsing
      try {
        return JSON.parse(compressedData);
      } catch (parseError) {
        console.error('Failed to decompress and parse data:', error);
        return null;
      }
    }
  }

  /**
   * Simple LZ77-like compression
   */
  private compress(str: string): string {
    const dict: { [key: string]: number } = {};
    const result: (string | number)[] = [];
    let dictSize = 256;

    for (let i = 0; i < 256; i++) {
      dict[String.fromCharCode(i)] = i;
    }

    let w = '';
    for (const c of str) {
      const wc = w + c;
      if (dict[wc]) {
        w = wc;
      } else {
        result.push(dict[w]);
        dict[wc] = dictSize++;
        w = c;
      }
    }

    if (w) {
      result.push(dict[w]);
    }

    return JSON.stringify(result);
  }

  /**
   * Simple LZ77-like decompression
   */
  private decompress(compressed: string): string {
    const data = JSON.parse(compressed);
    const dict: { [key: number]: string } = {};
    let dictSize = 256;

    for (let i = 0; i < 256; i++) {
      dict[i] = String.fromCharCode(i);
    }

    let result = '';
    let w = String.fromCharCode(data[0]);
    result += w;

    for (let i = 1; i < data.length; i++) {
      const k = data[i];
      let entry: string;

      if (dict[k]) {
        entry = dict[k];
      } else if (k === dictSize) {
        entry = w + w.charAt(0);
      } else {
        throw new Error('Invalid compressed data');
      }

      result += entry;
      dict[dictSize++] = w + entry.charAt(0);
      w = entry;
    }

    return result;
  }

  /**
   * Preload critical resources
   */
  preloadResources(urls: string[]): Promise<void[]> {
    const promises = urls.map(url => {
      return new Promise<void>((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to preload ${url}`));
        document.head.appendChild(link);
      });
    });

    return Promise.all(promises);
  }

  /**
   * Lazy load images with intersection observer
   */
  setupLazyLoading(selector: string = 'img[data-src]'): void {
    if (!this.settings.enableLazyLoading || typeof window === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    document.querySelectorAll(selector).forEach(img => {
      observer.observe(img);
    });
  }

  /**
   * Manage cache with size limits
   */
  private setCacheItem(key: string, value: any): void {
    if (this.cache.size >= this.settings.cacheSize) {
      // Remove oldest item (FIFO)
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }

  /**
   * Perform memory cleanup
   */
  private performMemoryCleanup(): void {
    // Clear cache
    this.cache.clear();

    // Clear old metrics (keep only last 100)
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }

    console.log('Memory cleanup performed');
  }

  /**
   * Chunk array into smaller pieces
   */
  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Record performance metric
   */
  private recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    averageRenderTime: number;
    averageSearchTime: number;
    averageLoadTime: number;
    memoryUsage: number;
    cacheHitRate: number;
    totalMetrics: number;
  } {
    if (this.metrics.length === 0) {
      return {
        averageRenderTime: 0,
        averageSearchTime: 0,
        averageLoadTime: 0,
        memoryUsage: this.getMemoryUsage(),
        cacheHitRate: 0,
        totalMetrics: 0
      };
    }

    const renderTimes = this.metrics.filter(m => m.renderTime > 0);
    const searchTimes = this.metrics.filter(m => m.searchTime > 0);
    const loadTimes = this.metrics.filter(m => m.loadTime > 0);

    return {
      averageRenderTime: renderTimes.reduce((sum, m) => sum + m.renderTime, 0) / renderTimes.length || 0,
      averageSearchTime: searchTimes.reduce((sum, m) => sum + m.searchTime, 0) / searchTimes.length || 0,
      averageLoadTime: loadTimes.reduce((sum, m) => sum + m.loadTime, 0) / loadTimes.length || 0,
      memoryUsage: this.getMemoryUsage(),
      cacheHitRate: this.cache.size / Math.max(this.metrics.length, 1),
      totalMetrics: this.metrics.length
    };
  }

  /**
   * Update optimization settings
   */
  updateSettings(newSettings: Partial<OptimizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  /**
   * Get current settings
   */
  getSettings(): OptimizationSettings {
    return { ...this.settings };
  }

  /**
   * Reset to default settings
   */
  resetToDefaults(): void {
    this.settings = {
      enableVirtualization: true,
      chunkSize: 100,
      debounceDelay: 300,
      cacheSize: 1000,
      preloadItems: 5,
      enableCompression: true,
      enableLazyLoading: true
    };
    this.saveSettings();
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('performance_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save performance settings:', error);
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): OptimizationSettings {
    try {
      const stored = localStorage.getItem('performance_settings');
      if (stored) {
        return { ...this.getDefaultSettings(), ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load performance settings:', error);
    }
    return this.getDefaultSettings();
  }

  /**
   * Get default settings
   */
  private getDefaultSettings(): OptimizationSettings {
    return {
      enableVirtualization: true,
      chunkSize: 100,
      debounceDelay: 300,
      cacheSize: 1000,
      preloadItems: 5,
      enableCompression: true,
      enableLazyLoading: true
    };
  }

  /**
   * Clear all performance data
   */
  clearData(): void {
    this.metrics = [];
    this.cache.clear();
  }

  /**
   * Export performance report
   */
  exportReport(): string {
    const stats = this.getPerformanceStats();
    const report = {
      timestamp: new Date().toISOString(),
      settings: this.settings,
      statistics: stats,
      metrics: this.metrics.slice(-50), // Last 50 metrics
      browserInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        memory: this.getMemoryUsage()
      }
    };

    return JSON.stringify(report, null, 2);
  }
}

// Export singleton instance
export const performanceOptimizer = new PerformanceOptimizer();