import { CollectionPart } from '@/types/asmaulHusna';
import { partsMetadata } from '../metadata';

// Stub parts 8-13 with minimal content - to be filled later
const stubNames: Record<number, { names: Array<{ number: number; slug: string; nameArabic: string; transliteration: string; meaningId: string }> }> = {
  8: {
    names: [
      { number: 57, slug: 'al-muhshi', nameArabic: 'الْمُحْصِي', transliteration: 'Al-Muḥṣī', meaningId: 'Yang Maha Menghitung' },
      { number: 58, slug: 'al-mubdi', nameArabic: 'الْمُبْدِئُ', transliteration: 'Al-Mubdi\'', meaningId: 'Yang Maha Memulai' },
      { number: 59, slug: 'al-muid', nameArabic: 'الْمُعِيدُ', transliteration: 'Al-Mu\'īd', meaningId: 'Yang Maha Mengembalikan' },
      { number: 60, slug: 'al-muhyi', nameArabic: 'الْمُحْيِي', transliteration: 'Al-Muḥyī', meaningId: 'Yang Maha Menghidupkan' },
      { number: 61, slug: 'al-mumit', nameArabic: 'الْمُمِيتُ', transliteration: 'Al-Mumīt', meaningId: 'Yang Maha Mematikan' },
      { number: 62, slug: 'al-hayy', nameArabic: 'الْحَيُّ', transliteration: 'Al-Ḥayy', meaningId: 'Yang Maha Hidup' },
      { number: 63, slug: 'al-qayyum', nameArabic: 'الْقَيُّومُ', transliteration: 'Al-Qayyūm', meaningId: 'Yang Maha Berdiri Sendiri' },
      { number: 64, slug: 'al-wajid', nameArabic: 'الْوَاجِدُ', transliteration: 'Al-Wājid', meaningId: 'Yang Maha Menemukan' },
    ],
  },
  9: {
    names: [
      { number: 65, slug: 'al-majid2', nameArabic: 'الْمَاجِدُ', transliteration: 'Al-Mājid', meaningId: 'Yang Maha Mulia' },
      { number: 66, slug: 'al-wahid', nameArabic: 'الْوَاحِدُ', transliteration: 'Al-Wāḥid', meaningId: 'Yang Maha Esa' },
      { number: 67, slug: 'al-ahad', nameArabic: 'الْأَحَدُ', transliteration: 'Al-Aḥad', meaningId: 'Yang Maha Tunggal' },
      { number: 68, slug: 'as-samad', nameArabic: 'الصَّمَدُ', transliteration: 'Aṣ-Ṣamad', meaningId: 'Yang Maha Dibutuhkan' },
      { number: 69, slug: 'al-qadir', nameArabic: 'الْقَادِرُ', transliteration: 'Al-Qādir', meaningId: 'Yang Maha Kuasa' },
      { number: 70, slug: 'al-muqtadir', nameArabic: 'الْمُقْتَدِرُ', transliteration: 'Al-Muqtadir', meaningId: 'Yang Maha Menentukan' },
      { number: 71, slug: 'al-muqaddim', nameArabic: 'الْمُقَدِّمُ', transliteration: 'Al-Muqaddim', meaningId: 'Yang Maha Mendahulukan' },
      { number: 72, slug: 'al-muakhkhir', nameArabic: 'الْمُؤَخِّرُ', transliteration: 'Al-Mu\'akhkhir', meaningId: 'Yang Maha Mengakhirkan' },
    ],
  },
  10: {
    names: [
      { number: 73, slug: 'al-awwal', nameArabic: 'الْأَوَّلُ', transliteration: 'Al-Awwal', meaningId: 'Yang Maha Awal' },
      { number: 74, slug: 'al-akhir', nameArabic: 'الْآخِرُ', transliteration: 'Al-Ākhir', meaningId: 'Yang Maha Akhir' },
      { number: 75, slug: 'az-zahir', nameArabic: 'الظَّاهِرُ', transliteration: 'Aẓ-Ẓāhir', meaningId: 'Yang Maha Nyata' },
      { number: 76, slug: 'al-batin', nameArabic: 'الْبَاطِنُ', transliteration: 'Al-Bāṭin', meaningId: 'Yang Maha Tersembunyi' },
      { number: 77, slug: 'al-wali', nameArabic: 'الْوَالِي', transliteration: 'Al-Wālī', meaningId: 'Yang Maha Menguasai' },
      { number: 78, slug: 'al-mutaali', nameArabic: 'الْمُتَعَالِي', transliteration: 'Al-Muta\'ālī', meaningId: 'Yang Maha Tinggi' },
      { number: 79, slug: 'al-barr', nameArabic: 'الْبَرُّ', transliteration: 'Al-Barr', meaningId: 'Yang Maha Baik' },
      { number: 80, slug: 'at-tawwab', nameArabic: 'التَّوَّابُ', transliteration: 'At-Tawwāb', meaningId: 'Yang Maha Penerima Taubat' },
    ],
  },
  11: {
    names: [
      { number: 81, slug: 'al-muntaqim', nameArabic: 'الْمُنْتَقِمُ', transliteration: 'Al-Muntaqim', meaningId: 'Yang Maha Pembalas' },
      { number: 82, slug: 'al-afuww', nameArabic: 'الْعَفُوُّ', transliteration: 'Al-\'Afuww', meaningId: 'Yang Maha Pemaaf' },
      { number: 83, slug: 'ar-rauf', nameArabic: 'الرَّؤُوفُ', transliteration: 'Ar-Ra\'ūf', meaningId: 'Yang Maha Pengasih' },
      { number: 84, slug: 'malikul-mulk', nameArabic: 'مَالِكُ الْمُلْكِ', transliteration: 'Mālikul-Mulk', meaningId: 'Pemilik Kerajaan' },
      { number: 85, slug: 'dzul-jalal', nameArabic: 'ذُو الْجَلَالِ وَالْإِكْرَامِ', transliteration: 'Dzul-Jalāli wal-Ikrām', meaningId: 'Pemilik Keagungan dan Kemuliaan' },
      { number: 86, slug: 'al-muqsit', nameArabic: 'الْمُقْسِطُ', transliteration: 'Al-Muqsiṭ', meaningId: 'Yang Maha Adil' },
      { number: 87, slug: 'al-jami', nameArabic: 'الْجَامِعُ', transliteration: 'Al-Jāmi\'', meaningId: 'Yang Maha Mengumpulkan' },
      { number: 88, slug: 'al-ghani', nameArabic: 'الْغَنِيُّ', transliteration: 'Al-Ghaniyy', meaningId: 'Yang Maha Kaya' },
    ],
  },
  12: {
    names: [
      { number: 89, slug: 'al-mughni', nameArabic: 'الْمُغْنِي', transliteration: 'Al-Mughnī', meaningId: 'Yang Maha Pemberi Kekayaan' },
      { number: 90, slug: 'al-mani', nameArabic: 'الْمَانِعُ', transliteration: 'Al-Māni\'', meaningId: 'Yang Maha Mencegah' },
      { number: 91, slug: 'ad-darr', nameArabic: 'الضَّارُّ', transliteration: 'Aḍ-Ḍārr', meaningId: 'Yang Maha Memberi Mudarat' },
      { number: 92, slug: 'an-nafi', nameArabic: 'النَّافِعُ', transliteration: 'An-Nāfi\'', meaningId: 'Yang Maha Memberi Manfaat' },
      { number: 93, slug: 'an-nur', nameArabic: 'النُّورُ', transliteration: 'An-Nūr', meaningId: 'Yang Maha Bercahaya' },
      { number: 94, slug: 'al-hadi', nameArabic: 'الْهَادِي', transliteration: 'Al-Hādī', meaningId: 'Yang Maha Pemberi Petunjuk' },
      { number: 95, slug: 'al-badi', nameArabic: 'الْبَدِيعُ', transliteration: 'Al-Badī\'', meaningId: 'Yang Maha Pencipta Keindahan' },
      { number: 96, slug: 'al-baqi', nameArabic: 'الْبَاقِي', transliteration: 'Al-Bāqī', meaningId: 'Yang Maha Kekal' },
    ],
  },
  13: {
    names: [
      { number: 97, slug: 'al-warits', nameArabic: 'الْوَارِثُ', transliteration: 'Al-Wārits', meaningId: 'Yang Maha Mewarisi' },
      { number: 98, slug: 'ar-rasyid', nameArabic: 'الرَّشِيدُ', transliteration: 'Ar-Rasyīd', meaningId: 'Yang Maha Pemberi Petunjuk' },
      { number: 99, slug: 'as-sabur', nameArabic: 'الصَّبُورُ', transliteration: 'Aṣ-Ṣabūr', meaningId: 'Yang Maha Sabar' },
    ],
  },
};

export function getStubPart(partNumber: number): CollectionPart | null {
  const meta = partsMetadata.find(p => p.partNumber === partNumber);
  if (!meta || !stubNames[partNumber]) return null;

  return {
    id: meta.id,
    partNumber: meta.partNumber,
    title: meta.title,
    phaseTitle: meta.phaseTitle,
    asmaRange: meta.asmaRange,
    estimatedReadMinutes: meta.estimatedReadMinutes,
    introduction: `Bagian ini sedang dalam proses penyusunan. Insya Allah akan segera dilengkapi dengan doa lengkap untuk ${stubNames[partNumber].names.length} Asmaul Husna berikut.`,
    items: stubNames[partNumber].names.map(n => ({
      number: n.number,
      slug: n.slug,
      nameArabic: n.nameArabic,
      transliteration: n.transliteration,
      meaningId: n.meaningId,
      theme: [],
      explanation: 'Penjelasan akan segera ditambahkan.',
      dua: { translationId: 'Doa akan segera ditambahkan.' },
      evidence: [],
    })),
    closingParagraph: 'Bagian ini akan segera dilengkapi. Mohon bersabar.',
  };
}
