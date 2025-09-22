import {
  saveItems,
  loadItems,
  savePrefs,
  loadPrefs,
  saveTrash,
  loadTrash,
  clearExpiredTrash,
  exportData,
  importData,
} from '@/lib/storage'
import { Item, Prefs } from '@/types'

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

const mockItems: Item[] = [
  {
    id: '1',
    title: 'Test Prayer',
    arabic: 'اللَّهُمَّ',
    latin: 'Allahumma',
    translation_id: 'Ya Allah',
    category: 'Test',
    tags: ['test'],
    source: 'Test Source',
    favorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

const mockPrefs: Prefs = {
  theme: 'system',
  pageSize: 20,
  sortBy: 'updatedAt',
  sortDir: 'desc',
  visibleColumns: ['title', 'category', 'tags', 'updatedAt', 'favorite', 'actions'],
  arabicFontSize: 24,
  arabicLineHeight: 1.8,
}

describe('Storage Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('saveItems', () => {
    it('saves items to localStorage', () => {
      saveItems(mockItems)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'app:items:v1',
        JSON.stringify(mockItems)
      )
    })

    it('handles storage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full')
      })

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      saveItems(mockItems)

      expect(consoleSpy).toHaveBeenCalledWith('Could not save items:', expect.any(Error))

      // Reset mock after test
      mockLocalStorage.setItem.mockReset()
      consoleSpy.mockRestore()
    })
  })

  describe('loadItems', () => {
    it('loads items from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockItems))

      const result = loadItems()

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('app:items:v1')
      expect(result).toEqual(mockItems)
    })

    it('returns empty array when no items stored', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const result = loadItems()

      expect(result).toEqual([])
    })

    it('returns empty array on parse error', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json')

      const result = loadItems()

      expect(result).toEqual([])
    })
  })

  describe('savePrefs', () => {
    it('saves preferences to localStorage', () => {
      savePrefs(mockPrefs)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'app:prefs:v1',
        JSON.stringify(mockPrefs)
      )
    })
  })

  describe('loadPrefs', () => {
    it('loads preferences from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockPrefs))

      const result = loadPrefs()

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('app:prefs:v1')
      expect(result).toEqual(mockPrefs)
    })

    it('returns default preferences when none stored', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const result = loadPrefs()

      expect(result).toEqual({
        theme: 'system',
        pageSize: 20,
        sortBy: 'updatedAt',
        sortDir: 'desc',
        visibleColumns: ['title', 'category', 'tags', 'updatedAt', 'favorite', 'actions'],
        arabicFontSize: 28,
        arabicLineHeight: 1.9,
      })
    })
  })

  describe('trash management', () => {
    const mockTrashItems = [
      {
        ...mockItems[0],
        _deletedAt: Date.now(),
      },
    ]

    it('saves trash items', () => {
      // Suppress console.warn for this test
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      saveTrash(mockTrashItems)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'app:trash:v1',
        JSON.stringify(mockTrashItems)
      )

      consoleSpy.mockRestore()
    })

    it('loads trash items', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockTrashItems))

      const result = loadTrash()

      expect(result).toEqual(mockTrashItems)
    })

    it('clears expired trash items', () => {
      // Suppress console.warn for this test
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      const expiredTime = Date.now() - (31 * 24 * 60 * 60 * 1000) // 31 days ago
      const expiredTrash = [
        {
          item: mockItems[0],
          deletedAt: expiredTime,
        },
      ]
      const recentTrash = [
        {
          item: mockItems[0],
          deletedAt: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
        },
      ]

      mockLocalStorage.getItem.mockReturnValue(
        JSON.stringify([...expiredTrash, ...recentTrash])
      )

      clearExpiredTrash()

      // Check that cleanup occurred
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'app:trash:v1',
        expect.any(String)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('exportData', () => {
    it('exports all application data', () => {
      mockLocalStorage.getItem
        .mockReturnValueOnce(JSON.stringify(mockItems)) // items
        .mockReturnValueOnce(JSON.stringify(mockPrefs)) // prefs
        .mockReturnValueOnce(JSON.stringify([])) // trash

      const result = exportData()
      const parsed = JSON.parse(result)

      expect(parsed).toHaveProperty('items', mockItems)
      expect(parsed).toHaveProperty('prefs', mockPrefs)
      expect(parsed).toHaveProperty('trash', [])
      expect(parsed).toHaveProperty('version', '1.0')
      expect(parsed).toHaveProperty('exportedAt')
    })
  })

  describe('importData', () => {
    it('imports valid data successfully', () => {
      const exportedData = {
        items: mockItems,
        prefs: mockPrefs,
        trash: [],
        version: '1.0',
        exportedAt: new Date().toISOString(),
      }

      const result = importData(JSON.stringify(exportedData))

      expect(result.success).toBe(true)
      expect(result.importedItems).toBe(1)
    })

    it('handles invalid JSON', () => {
      const result = importData('invalid json')

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid JSON format')
    })

    it('handles missing required fields', () => {
      const invalidData = { version: '1.0' } // missing items, prefs

      const result = importData(JSON.stringify(invalidData))

      expect(result.success).toBe(false)
      expect(result.error).toContain('Missing required fields')
    })

    it('validates item structure', () => {
      const invalidData = {
        items: [{ id: '1' }], // missing required fields
        prefs: mockPrefs,
        trash: [],
        version: '1.0',
      }

      const result = importData(JSON.stringify(invalidData))

      expect(result.success).toBe(false)
      expect(result.error).toContain('Invalid item structure')
    })
  })
})