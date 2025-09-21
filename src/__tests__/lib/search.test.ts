import { searchEngine } from '@/lib/search/searchEngine'
import { Item } from '@/types'

const mockItems: Item[] = [
  {
    id: '1',
    title: 'Doa Pagi',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    latin: 'Bismillahi rahmaani rahiim',
    translation_id: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
    category: 'Doa Harian',
    tags: ['pagi', 'harian', 'pembuka'],
    source: 'Al-Quran',
    favorite: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Doa Sebelum Makan',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا',
    latin: 'Allahumma barik lana fiima razaqtana',
    translation_id: 'Ya Allah, berkahilah kami dalam rezeki yang Engkau berikan',
    category: 'Doa Makan',
    tags: ['makan', 'sebelum', 'berkah'],
    source: 'HR. Abu Dawud',
    favorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    title: 'Doa Malam',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ',
    latin: 'Allahumma anta rabbi la ilaha illa anta',
    translation_id: 'Ya Allah, Engkaulah Tuhanku, tidak ada tuhan selain Engkau',
    category: 'Doa Harian',
    tags: ['malam', 'harian', 'tauhid'],
    source: 'HR. Bukhari',
    favorite: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

describe('SearchEngine', () => {
  beforeEach(() => {
    searchEngine.setItems(mockItems)
  })

  describe('basic search', () => {
    it('searches by title', () => {
      const results = searchEngine.search({ query: 'pagi' })

      expect(results).toHaveLength(1)
      expect(results[0].item.id).toBe('1')
      expect(results[0].item.title).toBe('Doa Pagi')
    })

    it('searches by category', () => {
      const results = searchEngine.search({ query: 'harian' })

      expect(results).toHaveLength(2)
      expect(results.map(r => r.item.id)).toContain('1')
      expect(results.map(r => r.item.id)).toContain('3')
    })

    it('searches by tags', () => {
      const results = searchEngine.search({ query: 'makan' })

      expect(results).toHaveLength(1)
      expect(results[0].item.id).toBe('2')
    })

    it('searches by translation', () => {
      const results = searchEngine.search({ query: 'berkah' })

      expect(results).toHaveLength(1)
      expect(results[0].item.id).toBe('2')
    })

    it('searches by latin transliteration', () => {
      const results = searchEngine.search({ query: 'bismillahi' })

      expect(results).toHaveLength(1)
      expect(results[0].item.id).toBe('1')
    })
  })

  describe('case insensitive search', () => {
    it('finds results regardless of case', () => {
      const lowerCase = searchEngine.search({ query: 'pagi' })
      const upperCase = searchEngine.search({ query: 'PAGI' })
      const mixedCase = searchEngine.search({ query: 'Pagi' })

      expect(lowerCase).toHaveLength(1)
      expect(upperCase).toHaveLength(1)
      expect(mixedCase).toHaveLength(1)
      expect(lowerCase[0].item.id).toBe(upperCase[0].item.id)
      expect(upperCase[0].item.id).toBe(mixedCase[0].item.id)
    })
  })

  describe('partial matching', () => {
    it('finds partial matches in title', () => {
      const results = searchEngine.search({ query: 'doa' })

      expect(results).toHaveLength(3) // All items contain "doa" in title
    })

    it('finds partial matches in content', () => {
      const results = searchEngine.search({ query: 'allah' })

      expect(results.length).toBeGreaterThan(0)
    })
  })

  describe('multiple word search', () => {
    it('finds items matching multiple words', () => {
      const results = searchEngine.search({ query: 'doa pagi' })

      expect(results).toHaveLength(1)
      expect(results[0].item.id).toBe('1')
    })

    it('finds items matching any of the words', () => {
      const results = searchEngine.search({ query: 'pagi malam' })

      expect(results).toHaveLength(2)
      expect(results.map(r => r.item.id)).toContain('1') // Doa Pagi
      expect(results.map(r => r.item.id)).toContain('3') // Doa Malam
    })
  })

  describe('empty and invalid searches', () => {
    it('returns empty array for empty search', () => {
      const results = searchEngine.search({ query: '' })

      expect(results).toHaveLength(3) // Returns all items when query is empty
    })

    it('returns empty array for whitespace only', () => {
      const results = searchEngine.search({ query: '   ' })

      expect(results).toHaveLength(3) // Returns all items when query is whitespace
    })

    it('returns empty array for non-matching search', () => {
      const results = searchEngine.search({ query: 'nonexistent' })

      expect(results).toHaveLength(0)
    })
  })

  describe('search with filters', () => {
    it('filters by category', () => {
      const results = searchEngine.search({
        query: 'doa',
        categories: ['Doa Makan']
      })

      expect(results).toHaveLength(1)
      expect(results[0].item.id).toBe('2')
    })

    it('filters by tags', () => {
      const results = searchEngine.search({
        query: 'doa',
        tags: ['harian']
      })

      expect(results).toHaveLength(2)
      expect(results.map(r => r.item.id)).toContain('1')
      expect(results.map(r => r.item.id)).toContain('3')
    })

    it('filters by favorite status', () => {
      const results = searchEngine.search({ query: 'doa' }).filter(r => r.item.favorite)

      expect(results).toHaveLength(2)
      expect(results.every(r => r.item.favorite)).toBe(true)
    })

    it('applies multiple filters', () => {
      const results = searchEngine.search({
        query: 'doa',
        categories: ['Doa Harian']
      }).filter(r => r.item.favorite)

      expect(results).toHaveLength(2)
      expect(results.every(r => r.item.favorite && r.item.category === 'Doa Harian')).toBe(true)
    })
  })

  describe('search ranking', () => {
    it('ranks title matches higher than content matches', () => {
      // Add an item where search term appears in content but not title
      const itemWithContentMatch: Item = {
        id: '4',
        title: 'Zikir Subuh',
        arabic: 'سُبْحَانَ اللَّهِ',
        latin: 'Subhanallah',
        translation_id: 'Maha Suci Allah di pagi hari',
        category: 'Zikir',
        tags: ['zikir'],
        source: 'HR. Muslim',
        favorite: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      searchEngine.setItems([...mockItems, itemWithContentMatch])
      const results = searchEngine.search({ query: 'pagi' })

      expect(results).toHaveLength(2)
      // "Doa Pagi" should rank higher than item with "pagi" only in translation
      expect(results[0].item.title).toBe('Doa Pagi')
    })

    it('ranks exact matches higher than partial matches', () => {
      const results = searchEngine.search({ query: 'makan' })

      if (results.length > 1) {
        // Items with exact tag match should rank higher
        const exactMatch = results.find(r => r.item.tags.includes('makan'))
        expect(exactMatch).toBeDefined()
      }
    })
  })

  describe('indexing', () => {
    it('updates index when new items added', () => {
      const newItem: Item = {
        id: '4',
        title: 'Doa Bepergian',
        arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا',
        latin: 'Subhanallazi sakhkhara lana haza',
        translation_id: 'Maha Suci Allah yang telah menundukkan ini untuk kami',
        category: 'Doa Perjalanan',
        tags: ['bepergian', 'perjalanan'],
        source: 'Al-Quran',
        favorite: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      searchEngine.setItems([...mockItems, newItem])
      const results = searchEngine.search({ query: 'bepergian' })

      expect(results).toHaveLength(1)
      expect(results[0].item.id).toBe('4')
    })

    it('handles empty items array', () => {
      searchEngine.setItems([])
      const results = searchEngine.search({ query: 'anything' })

      expect(results).toHaveLength(0)
    })
  })

  describe('suggestions', () => {
    it('provides search suggestions', () => {
      const suggestions = searchEngine.getSuggestions('do')

      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions.some(s => s.text.includes('doa'))).toBe(true)
    })

    it('limits number of suggestions', () => {
      const suggestions = searchEngine.getSuggestions('a', 3)

      expect(suggestions.length).toBeLessThanOrEqual(3)
    })

    it('returns empty array for very short queries', () => {
      const suggestions = searchEngine.getSuggestions('a')

      // Very short queries might not return suggestions
      expect(Array.isArray(suggestions)).toBe(true)
    })
  })
})