import { Item } from '@/types';
import { fullDetailedPrayerData } from './fullDetailedPrayers';

/**
 * Export full detailed prayer data as the main initialPrayerData
 * Total: 21 doa yang sudah direorganisasi dan digabungkan dengan detail lengkap
 * Versi panjang dan sangat detail, tidak disingkat
 *
 * Struktur doa:
 * 1-6: Zikir dan doa dasar setelah shalat
 * 7: Shalawat Ibrahimiyah (DITAMBAHKAN)
 * 8: Doa Jawami'ul Kalim
 * 9: Doa Super Komprehensif dengan 99 Asmaul Husna
 * 10-12: Doa inti (rahmat, tawakal, pertolongan)
 * 13-15: Doa gabungan (hidayah/akhlak, rezeki/ilmu, keluarga)
 * 16-21: Doa tambahan penting (aktivitas harian, perlindungan, istikharah)
 */
export const initialPrayerData: Partial<Item>[] = fullDetailedPrayerData;