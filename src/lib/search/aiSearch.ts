/**
 * AI-Enhanced Search System
 * Combines traditional search with AI semantic understanding and re-ranking
 */

import { Item } from '@/types';
import { searchEngine, SearchResult } from './searchEngine';
import { aiComplete } from '@/lib/ai/client';

export interface AISearchResult extends SearchResult {
  aiScore: number;
  aiReason: string;
  semanticMatches: string[];
  confidence: number;
}

export interface SemanticSearchOptions {
  query: string;
  items?: Item[];
  useAI?: boolean;
  contextual?: boolean;
  rerank?: boolean;
  limit?: number;
  minConfidence?: number;
}

class AISearchEngine {
  private semanticCache: Map<string, any> = new Map();
  private contextHistory: string[] = [];

  // Semantic search with AI understanding
  async semanticSearch(options: SemanticSearchOptions): Promise<AISearchResult[]> {
    const {
      query,
      items,
      useAI = true,
      contextual = true,
      rerank = true,
      limit = 10,
      minConfidence = 0.3
    } = options;

    // Set items for search engine if provided
    if (items) {
      searchEngine.setItems(items);
    }

    // Get initial search results
    const initialResults = searchEngine.search({ query, limit: limit * 2 });

    if (initialResults.length === 0) {
      return [];
    }

    if (!useAI) {
      // Return basic results without AI enhancement
      return initialResults.map(result => ({
        ...result,
        aiScore: result.score,
        aiReason: 'Basic search match',
        semanticMatches: [],
        confidence: 0.7
      }));
    }

    // Enhance with AI if enabled
    return await this.enhanceWithAI(query, initialResults, {
      contextual,
      rerank,
      limit,
      minConfidence
    });
  }

  // AI Enhancement and Re-ranking
  private async enhanceWithAI(
    query: string,
    results: SearchResult[],
    options: {
      contextual: boolean;
      rerank: boolean;
      limit: number;
      minConfidence: number;
    }
  ): Promise<AISearchResult[]> {
    const { contextual, rerank, limit, minConfidence } = options;

    try {
      // Check cache first
      const cacheKey = `${query}:${results.map(r => r.item.id).join(',')}`;
      if (this.semanticCache.has(cacheKey)) {
        return this.semanticCache.get(cacheKey);
      }

      // Build context for AI
      const context = contextual ? this.buildSearchContext(query) : '';

      // Prepare data for AI analysis
      const itemsForAnalysis = results.map((result, index) => ({
        index,
        id: result.item.id,
        title: result.item.title,
        category: result.item.category,
        tags: result.item.tags?.join(', ') || '',
        translation: result.item.translation_id?.substring(0, 200) || '',
        latin: result.item.latin?.substring(0, 100) || '',
        originalScore: result.score,
        matchedFields: result.matchedFields?.join(', ') || ''
      }));

      const prompt = this.buildAIPrompt(query, itemsForAnalysis, context);
      const aiResponse = await aiComplete({
        messages: [
          {
            role: 'system',
            content: 'You are an expert in Islamic prayers and duas. Analyze search relevance with deep understanding of Islamic context, situations, and meanings.'
          },
          { role: 'user', content: prompt }
        ]
      });

      // Parse AI response
      const enhancedResults = await this.parseAIResponse(aiResponse, results);

      // Apply re-ranking if enabled
      const finalResults = rerank
        ? this.rerankResults(enhancedResults)
        : enhancedResults;

      // Filter by confidence and limit
      const filteredResults = finalResults
        .filter(result => result.confidence >= minConfidence)
        .slice(0, limit);

      // Cache results
      this.semanticCache.set(cacheKey, filteredResults);

      // Update context history
      this.updateContext(query);

      return filteredResults;

    } catch (error) {
      console.error('AI search enhancement failed:', error);

      // Fallback to basic results
      return results.slice(0, limit).map(result => ({
        ...result,
        aiScore: result.score,
        aiReason: 'AI enhancement failed, using basic search',
        semanticMatches: [],
        confidence: 0.5
      }));
    }
  }

  // Build search context from history
  private buildSearchContext(currentQuery: string): string {
    if (this.contextHistory.length === 0) return '';

    const recentQueries = this.contextHistory.slice(-3);
    return `Recent search context: ${recentQueries.join(' → ')} → ${currentQuery}`;
  }

  // Build AI prompt for analysis
  private buildAIPrompt(query: string, items: any[], context: string): string {
    return `
Analyze the relevance of these Islamic prayers/duas for the search query.

Search Query: "${query}"
${context ? `Context: ${context}` : ''}

Consider:
1. Direct meaning and purpose of the prayer
2. Situations where it would be used
3. Emotional/spiritual context
4. Arabic terms and their significance
5. Traditional Islamic categorization

For each prayer, provide:
- Relevance score (0-10)
- Detailed reason for relevance
- Specific semantic matches found
- Confidence level (0-1)

Prayers to analyze:
${items.map(item => `
${item.index}. "${item.title}"
   Category: ${item.category}
   Tags: ${item.tags}
   Translation: ${item.translation}
   Latin: ${item.latin}
   Original Score: ${item.originalScore}
`).join('')}

Return JSON in this exact format:
{
  "analyses": [
    {
      "index": 0,
      "relevanceScore": 8.5,
      "reason": "Detailed explanation of why this prayer matches the query...",
      "semanticMatches": ["specific", "terms", "or", "concepts", "that", "match"],
      "confidence": 0.9,
      "contextualRelevance": "Explanation of situational appropriateness..."
    }
  ]
}`;
  }

  // Parse AI response and enhance results
  private async parseAIResponse(response: string, originalResults: SearchResult[]): Promise<AISearchResult[]> {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      const analyses = parsed.analyses || [];

      return originalResults.map((result, index) => {
        const analysis = analyses.find((a: any) => a.index === index);

        if (analysis) {
          return {
            ...result,
            aiScore: analysis.relevanceScore || result.score,
            aiReason: analysis.reason || 'No specific reason provided',
            semanticMatches: analysis.semanticMatches || [],
            confidence: analysis.confidence || 0.5
          };
        }

        // Default enhancement if no AI analysis
        return {
          ...result,
          aiScore: result.score,
          aiReason: 'Standard search match',
          semanticMatches: [],
          confidence: 0.6
        };
      });

    } catch (error) {
      console.error('Failed to parse AI response:', error);

      // Fallback enhancement
      return originalResults.map(result => ({
        ...result,
        aiScore: result.score,
        aiReason: 'AI parsing failed, using standard scoring',
        semanticMatches: [],
        confidence: 0.5
      }));
    }
  }

  // Re-rank results based on AI scores and confidence
  private rerankResults(results: AISearchResult[]): AISearchResult[] {
    return results.sort((a, b) => {
      // Primary sort by AI score weighted by confidence
      const scoreA = a.aiScore * a.confidence;
      const scoreB = b.aiScore * b.confidence;

      if (Math.abs(scoreA - scoreB) > 0.5) {
        return scoreB - scoreA;
      }

      // Secondary sort by confidence if scores are close
      if (Math.abs(a.confidence - b.confidence) > 0.1) {
        return b.confidence - a.confidence;
      }

      // Tertiary sort by original search score
      return b.score - a.score;
    });
  }

  // Update context history
  private updateContext(query: string): void {
    this.contextHistory.push(query);

    // Keep only last 5 queries
    if (this.contextHistory.length > 5) {
      this.contextHistory = this.contextHistory.slice(-5);
    }
  }

  // Clear cache and context
  clearCache(): void {
    this.semanticCache.clear();
    this.contextHistory = [];
  }

  // Get search suggestions based on context and AI understanding
  async getSmartSuggestions(partialQuery: string, limit: number = 5): Promise<string[]> {
    if (partialQuery.length < 2) return [];

    try {
      const context = this.buildSearchContext(partialQuery);

      const prompt = `
Given the partial search query "${partialQuery}" for Islamic prayers/duas, suggest ${limit} relevant completions.

${context ? `Previous search context: ${context}` : ''}

Consider:
- Common Islamic prayer situations
- Arabic terms and their meanings
- Emotional and spiritual contexts
- Daily prayer needs
- Special occasions and circumstances

Return only a JSON array of suggestions:
["suggestion1", "suggestion2", "suggestion3"]
`;

      const response = await aiComplete({
        messages: [
          {
            role: 'system',
            content: 'You are an expert in Islamic prayers. Provide helpful search suggestions for finding relevant duas and prayers.'
          },
          { role: 'user', content: prompt }
        ]
      });

      // Extract suggestions from response
      const jsonMatch = response.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return Array.isArray(suggestions) ? suggestions.slice(0, limit) : [];
      }

      return [];

    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      return [];
    }
  }

  // Contextual search based on user's current state/time/etc.
  async contextualSearch(
    query: string,
    context: {
      timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
      occasion?: string;
      mood?: 'grateful' | 'seeking' | 'troubled' | 'peaceful';
      recentActions?: string[];
    }
  ): Promise<AISearchResult[]> {
    const contextualQuery = this.buildContextualQuery(query, context);

    return await this.semanticSearch({
      query: contextualQuery,
      useAI: true,
      contextual: true,
      rerank: true,
      limit: 10
    });
  }

  // Build enhanced query with context
  private buildContextualQuery(
    originalQuery: string,
    context: {
      timeOfDay?: string;
      occasion?: string;
      mood?: string;
      recentActions?: string[];
    }
  ): string {
    let enhanced = originalQuery;

    if (context.timeOfDay) {
      enhanced += ` ${context.timeOfDay}`;
    }

    if (context.occasion) {
      enhanced += ` ${context.occasion}`;
    }

    if (context.mood) {
      enhanced += ` feeling ${context.mood}`;
    }

    if (context.recentActions?.length) {
      enhanced += ` after ${context.recentActions.join(' ')}`;
    }

    return enhanced;
  }
}

// Export singleton instance
export const aiSearchEngine = new AISearchEngine();

// Utility functions
export async function smartSearch(query: string, items?: Item[]): Promise<AISearchResult[]> {
  return await aiSearchEngine.semanticSearch({
    query,
    items,
    useAI: true,
    contextual: true,
    rerank: true
  });
}

export async function quickSearch(query: string, items?: Item[]): Promise<AISearchResult[]> {
  return await aiSearchEngine.semanticSearch({
    query,
    items,
    useAI: false,
    contextual: false,
    rerank: false
  });
}

export async function getSearchSuggestions(partialQuery: string): Promise<string[]> {
  return await aiSearchEngine.getSmartSuggestions(partialQuery);
}

export function clearSearchCache(): void {
  aiSearchEngine.clearCache();
}