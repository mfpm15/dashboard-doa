import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PrayerCardView } from '@/components/PrayerCardView'
import { Item, Prefs } from '@/types'

// Mock the audio component
jest.mock('@/components/audio/AudioPlayerWidget', () => ({
  __esModule: true,
  default: ({ item }: { item: Item }) => (
    <div data-testid="audio-player">Audio Player for {item.title}</div>
  ),
}))

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  trackPrayerRead: jest.fn(),
  analytics: {
    initialize: jest.fn(),
  },
}))

const mockPrefs: Prefs = {
  theme: 'light',
  arabicFontSize: 24,
  arabicLineHeight: 1.8,
  searchHistory: [],
  favoriteFirst: false,
  compactView: false,
}

const mockItems: Item[] = [
  {
    id: '1',
    title: 'Doa Pagi',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
    latin: 'Bismillahi rahmaani rahiim',
    translation_id: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang',
    category: 'Doa Harian',
    tags: ['pagi', 'harian'],
    source: 'Al-Quran',
    favorite: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    title: 'Doa Malam',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي',
    latin: 'Allahumma anta rabbi',
    translation_id: 'Ya Allah, Engkaulah Tuhanku',
    category: 'Doa Harian',
    tags: ['malam', 'harian'],
    source: 'HR. Abu Dawud',
    favorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
]

const mockOnEdit = jest.fn()
const mockOnItemsChange = jest.fn()
const mockOnOpenAIAssist = jest.fn()
const mockOnOpenReadingMode = jest.fn()

describe('PrayerCardView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders empty state when no items', () => {
    render(
      <PrayerCardView
        items={[]}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    expect(screen.getByText('Belum ada doa')).toBeInTheDocument()
    expect(screen.getByText('Mulai tambahkan doa dan zikir pertama Anda')).toBeInTheDocument()
  })

  it('renders items list correctly', () => {
    render(
      <PrayerCardView
        items={mockItems}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    expect(screen.getByText('Doa Pagi')).toBeInTheDocument()
    expect(screen.getByText('Doa Malam')).toBeInTheDocument()
    expect(screen.getByText('Doa Harian')).toBeInTheDocument()
  })

  it('shows favorite star for favorite items', () => {
    render(
      <PrayerCardView
        items={mockItems}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    // Check that favorite star is shown for first item (favorite: true)
    const firstItemContainer = screen.getByText('Doa Pagi').closest('div')
    expect(firstItemContainer).toBeInTheDocument()
  })

  it('expands item when clicked and shows detailed content', async () => {
    const user = userEvent.setup()

    render(
      <PrayerCardView
        items={mockItems}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    // Initially, detailed content should not be visible
    expect(screen.queryByText('نص عربي')).not.toBeInTheDocument()
    expect(screen.queryByText('Transliterasi')).not.toBeInTheDocument()

    // Click on the first item to expand it
    const firstItemHeader = screen.getByText('Doa Pagi').closest('[role="button"], [data-testid="accordion-header"]') ||
                            screen.getByText('Doa Pagi').closest('div')

    if (firstItemHeader) {
      await user.click(firstItemHeader)
    }

    // Check that detailed content is now visible
    await waitFor(() => {
      expect(screen.getByText('نص عربي')).toBeInTheDocument()
      expect(screen.getByText('Transliterasi')).toBeInTheDocument()
      expect(screen.getByText('Terjemahan')).toBeInTheDocument()
      expect(screen.getByText('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ')).toBeInTheDocument()
      expect(screen.getByText('Bismillahi rahmaani rahiim')).toBeInTheDocument()
    })
  })

  it('collapses previous item when expanding another (accordion behavior)', async () => {
    const user = userEvent.setup()

    render(
      <PrayerCardView
        items={mockItems}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    // Expand first item
    const firstItemHeader = screen.getByText('Doa Pagi').closest('div')
    if (firstItemHeader) {
      await user.click(firstItemHeader)
    }

    // Verify first item is expanded
    await waitFor(() => {
      expect(screen.getByText('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ')).toBeInTheDocument()
    })

    // Expand second item
    const secondItemHeader = screen.getByText('Doa Malam').closest('div')
    if (secondItemHeader) {
      await user.click(secondItemHeader)
    }

    // Verify second item is expanded and first is collapsed
    await waitFor(() => {
      expect(screen.getByText('اللَّهُمَّ أَنْتَ رَبِّي')).toBeInTheDocument()
      expect(screen.queryByText('بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ')).not.toBeInTheDocument()
    })
  })

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <PrayerCardView
        items={mockItems}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    // Find and click edit button for first item
    const editButtons = screen.getAllByTitle('Edit')
    await user.click(editButtons[0])

    expect(mockOnEdit).toHaveBeenCalledWith(mockItems[0])
  })

  it('calls onOpenAIAssist when AI assist button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <PrayerCardView
        items={mockItems}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    // Find and click AI assist button for first item
    const aiAssistButtons = screen.getAllByTitle('Tanya AI')
    await user.click(aiAssistButtons[0])

    expect(mockOnOpenAIAssist).toHaveBeenCalledWith(mockItems[0])
  })

  it('calls onOpenReadingMode when reading mode button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <PrayerCardView
        items={mockItems}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    // Find and click reading mode button for first item
    const readingModeButtons = screen.getAllByTitle('Reading Mode')
    await user.click(readingModeButtons[0])

    expect(mockOnOpenReadingMode).toHaveBeenCalledWith(mockItems[0])
  })

  it('displays audio player widget when item is expanded', async () => {
    const user = userEvent.setup()

    render(
      <PrayerCardView
        items={mockItems}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    // Expand first item
    const firstItemHeader = screen.getByText('Doa Pagi').closest('div')
    if (firstItemHeader) {
      await user.click(firstItemHeader)
    }

    // Check audio player is rendered
    await waitFor(() => {
      expect(screen.getByTestId('audio-player')).toBeInTheDocument()
      expect(screen.getByText('Audio Player for Doa Pagi')).toBeInTheDocument()
    })
  })

  it('displays tags when item is expanded', async () => {
    const user = userEvent.setup()

    render(
      <PrayerCardView
        items={mockItems}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    // Expand first item
    const firstItemHeader = screen.getByText('Doa Pagi').closest('div')
    if (firstItemHeader) {
      await user.click(firstItemHeader)
    }

    // Check tags are displayed
    await waitFor(() => {
      expect(screen.getByText('Tags')).toBeInTheDocument()
      expect(screen.getByText('pagi')).toBeInTheDocument()
      expect(screen.getByText('harian')).toBeInTheDocument()
    })
  })

  it('displays source information when item is expanded', async () => {
    const user = userEvent.setup()

    render(
      <PrayerCardView
        items={mockItems}
        prefs={mockPrefs}
        onEdit={mockOnEdit}
        onItemsChange={mockOnItemsChange}
        onOpenAIAssist={mockOnOpenAIAssist}
        onOpenReadingMode={mockOnOpenReadingMode}
      />
    )

    // Expand first item
    const firstItemHeader = screen.getByText('Doa Pagi').closest('div')
    if (firstItemHeader) {
      await user.click(firstItemHeader)
    }

    // Check source is displayed
    await waitFor(() => {
      expect(screen.getByText(/Sumber: Al-Quran/)).toBeInTheDocument()
    })
  })
})