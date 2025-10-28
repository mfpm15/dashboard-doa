import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { PrayerCardView } from '@/components/PrayerCardView';
import { Item } from '@/types';

const mockItems: Item[] = [
  {
    id: '1',
    title: 'Doa Keteguhan Hati',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا',
    latin: 'Rabbana la tuzigh qulubana',
    translation_id: 'Ya Rabb kami, janganlah Engkau palingkan hati kami setelah Engkau beri petunjuk.',
    category: 'Doa Iman & Akhlak',
    tags: ['iman', 'hidayah'],
    source: 'QS Ali Imran: 8',
    favorite: true,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    title: 'Doa Memohon Rezeki',
    arabic: 'رَبِّ إِنِّي لِمَا أَنْزَلْتَ إِلَيَّ',
    latin: 'Rabbi inni lima anzalta ilayya',
    translation_id: 'Ya Rabbku, sungguh aku sangat membutuhkan setiap kebaikan yang Engkau turunkan kepadaku.',
    category: 'Doa Hajat Dunia',
    tags: ['rezeki'],
    source: 'QS Al-Qasas: 24',
    favorite: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

describe('PrayerCardView', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      value: jest.fn(),
    });
  });

  it('renders empty state when no items provided', () => {
    render(
      <PrayerCardView
        items={[]}
        searchTerm=""
        showLatin
        showTranslation
        showSource
        arabicFontSize={28}
        onMoveItem={jest.fn()}
      />
    );

    expect(screen.getByText('Doa belum ditemukan')).toBeInTheDocument();
    expect(
      screen.getByText(/Coba ubah kata kunci pencarian atau pilih kategori lain/i)
    ).toBeInTheDocument();
  });

  it('renders prayer cards with headers collapsed', () => {
    render(
      <PrayerCardView
        items={mockItems}
        searchTerm=""
        showLatin
        showTranslation
        showSource
        arabicFontSize={30}
        onMoveItem={jest.fn()}
      />
    );

    expect(screen.getByText('Doa Keteguhan Hati')).toBeInTheDocument();
    expect(screen.getByText('Doa Memohon Rezeki')).toBeInTheDocument();
    expect(screen.queryByText('رَبَّنَا لَا تُزِغْ قُلُوبَنَا')).not.toBeInTheDocument();
  });

  it('expands card content when header clicked', async () => {
    const user = userEvent.setup();

    render(
      <PrayerCardView
        items={mockItems}
        searchTerm=""
        showLatin
        showTranslation
        showSource
        arabicFontSize={30}
        onMoveItem={jest.fn()}
      />
    );

    const headerButton = screen.getByRole('button', { name: /Doa Keteguhan Hati/ });
    await user.click(headerButton);
    expect(await screen.findByText('رَبَّنَا لَا تُزِغْ قُلُوبَنَا')).toBeInTheDocument();

    await user.click(headerButton);
    expect(screen.queryByText('رَبَّنَا لَا تُزِغْ قُلُوبَنَا')).not.toBeInTheDocument();
  });

  it('highlights search term inside content', () => {
    render(
      <PrayerCardView
        items={mockItems}
        searchTerm="hati"
        showLatin
        showTranslation
        showSource
        arabicFontSize={28}
        onMoveItem={jest.fn()}
      />
    );

    const highlighted = screen.getAllByText('hati', { exact: false });
    expect(highlighted.length).toBeGreaterThan(0);
    highlighted.forEach(node => {
      expect(node.tagName.toLowerCase()).toBe('mark');
    });
  });

  it('triggers reorder handler when arrow buttons clicked', async () => {
    const user = userEvent.setup();
    const handleMove = jest.fn();

    render(
      <PrayerCardView
        items={mockItems}
        searchTerm=""
        showLatin
        showTranslation
        showSource
        arabicFontSize={28}
        onMoveItem={handleMove}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /Doa Keteguhan Hati/ });
    await user.click(toggleButton);

    const moveDownButton = screen.getAllByRole('button', { name: /Geser doa ke bawah/i })[0];
    await user.click(moveDownButton);
    expect(handleMove).toHaveBeenCalledWith('1', 'down');

    const moveUpButton = screen.getAllByRole('button', { name: /Geser doa ke atas/i })[1];
    await user.click(moveUpButton);
    expect(handleMove).toHaveBeenCalledWith('2', 'up');
  });

  it('invokes reorder handler when arrow buttons clicked', async () => {
    const user = userEvent.setup();
    const handleMove = jest.fn();

    render(
      <PrayerCardView
        items={mockItems}
        searchTerm=""
        showLatin
        showTranslation
        showSource
        arabicFontSize={28}
        onMoveItem={handleMove}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /Doa Keteguhan Hati/ });
    await user.click(toggleButton);

    const moveDownButton = screen.getAllByRole('button', { name: /Geser doa ke bawah/i })[0];
    await user.click(moveDownButton);
    expect(handleMove).toHaveBeenCalledWith('1', 'down');

    const moveUpButton = screen.getAllByRole('button', { name: /Geser doa ke atas/i })[1];
    await user.click(moveUpButton);
    expect(handleMove).toHaveBeenCalledWith('2', 'up');
  });
});
