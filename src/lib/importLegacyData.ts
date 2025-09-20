import { Item } from '@/types';
import { addItem } from '@/lib/storage';

// Legacy data format from index.html
interface LegacyPrayerData {
  id: number;
  title: string;
  category: string;
  kaidah?: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
}

// Mapping function to convert legacy data to new format
function convertLegacyItem(legacy: LegacyPrayerData): Omit<Item, 'id' | 'createdAt' | 'updatedAt'> {
  // Extract tags from title and category
  const tags: string[] = [];

  // Auto-generate tags based on content
  const title = legacy.title.toLowerCase();
  const category = legacy.category.toLowerCase();

  if (title.includes('istighfar')) tags.push('istighfar');
  if (title.includes('tasbih')) tags.push('tasbih');
  if (title.includes('tahmid')) tags.push('tahmid');
  if (title.includes('takbir')) tags.push('takbir');
  if (title.includes('tahlil')) tags.push('tahlil');
  if (title.includes('shalawat')) tags.push('shalawat');
  if (title.includes('ayat kursi')) tags.push('ayat-kursi');
  if (title.includes('al-mu\'awwidzat')) tags.push('mu-awwidzat');
  if (title.includes('doa') && !title.includes('istighfar')) tags.push('doa');
  if (title.includes('nabi')) tags.push('doa-nabi');
  if (title.includes('orang tua')) tags.push('orang-tua');
  if (title.includes('keluarga')) tags.push('keluarga');
  if (title.includes('rezeki')) tags.push('rezeki');
  if (title.includes('kesehatan')) tags.push('kesehatan');
  if (title.includes('perlindungan')) tags.push('perlindungan');
  if (title.includes('pagi') || title.includes('petang')) tags.push('pagi-petang');

  // Category-based tags
  if (category.includes('zikir')) tags.push('zikir');
  if (category.includes('shalat')) tags.push('setelah-shalat');
  if (category.includes('pengampunan')) tags.push('ampunan');
  if (category.includes('iman')) tags.push('iman');
  if (category.includes('akhlak')) tags.push('akhlak');
  if (category.includes('hajat')) tags.push('hajat');
  if (category.includes('dunia')) tags.push('dunia');
  if (category.includes('akhirat')) tags.push('akhirat');
  if (category.includes('mustajab')) tags.push('mustajab');

  // Mark important/popular prayers as favorites
  const shouldBeFavorite = title.includes('ayat kursi') ||
                          title.includes('istighfar') ||
                          title.includes('sapu jagat') ||
                          title.includes('sayyidul istighfar') ||
                          category.includes('mustajab');

  return {
    title: legacy.title,
    arabic: legacy.arabic,
    latin: legacy.latin,
    translation_id: legacy.translation,
    category: legacy.category,
    tags: [...new Set(tags)], // Remove duplicates
    source: legacy.source,
    favorite: shouldBeFavorite
  };
}

// Legacy data from index.html
const legacyData: LegacyPrayerData[] = [
  { "id": 1, "title": "Istighfar & Doa Keselamatan (Pembuka Zikir)", "category": "Zikir Setelah Shalat", "kaidah": "Amalan pertama setelah salam: istighfar tiga kali lalu memuji Allah sebagai As-Salām.", "arabic": "أَسْتَغْفِرُ اللَّهَ (٣x)\n\nاللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.", "latin": "Astaghfirullāh (3x). Allāhumma anta as-salām, wa minka as-salām, tabārakta yā dzal-jalāli wal-ikrām.", "translation": "\"Aku memohon ampun kepada Allah\" (3x). \"Ya Allah, Engkau Mahasejahtera, dan dari-Mu segala kesejahteraan. Mahaberkah Engkau, wahai Pemilik keagungan dan kemuliaan.\"", "source": "HR Muslim." },
  { "id": 2, "title": "Tasbih, Tahmid, Takbir (33x) & Tahlil", "category": "Zikir Setelah Shalat", "kaidah": "Zikir ringan berpahala besar setelah shalat fardhu.", "arabic": "سُبْحَانَ اللَّهِ (٣٣x) اَلْحَمْدُ لِلَّهِ (٣٣x) اللَّهُ أَكْبَرُ (٣٣x)\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْkُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "latin": "Subḥānallāh (33x), al-ḥamdu lillāh (33x), Allāhu akbar (33x). Lā ilāha illallāhu waḥdahū lā syarīka lah, lahul-mulku wa lahul-ḥamdu, wa huwa 'alā kulli syay'in qadīr (1x).", "translation": "Mahasuci Allah (33x), segala puji bagi Allah (33x), Allah Mahabesar (33x). Tiada sesembahan selain Allah Yang Esa, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan pujian, dan Dia Mahakuasa atas segala sesuatu.", "source": "HR Muslim." },
  { "id": 3, "title": "Ayat Kursi", "category": "Zikir Setelah Shalat", "kaidah": "Ayat paling agung dalam Al-Qur'an, dibaca setelah shalat fardhu.", "arabic": "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ", "latin": "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta'khudzuhu sinatun wa lā nawm, lahu mā fis-samāwāti wa mā fil-arḍ, man dzal-ladzī yasyfa'u 'indahū illā bi-idznih, ya'lamu mā baina aydīhim wa mā khalfahum, wa lā yuḥīṭūna bisyay'in min 'ilmihī illā bimā syā', wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm.", "translation": "Allah, tiada tuhan selain Dia, Yang Mahahidup, Yang terus-menerus mengurus (makhluk-Nya). Tidak mengantuk dan tidak tidur. Milik-Nya apa yang di langit dan di bumi. Siapa yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya? Dia mengetahui apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui sesuatu pun dari ilmu-Nya kecuali apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi, dan Dia tidak merasa berat memelihara keduanya. Dia Mahatinggi lagi Mahabesar.", "source": "QS Al-Baqarah: 255." }
];

// Add more legacy data... (truncated for brevity)

export function importLegacyData(): void {
  try {
    let importedCount = 0;

    legacyData.forEach(legacy => {
      try {
        const convertedItem = convertLegacyItem(legacy);
        addItem(convertedItem);
        importedCount++;
      } catch (error) {
        console.error(`Failed to import item: ${legacy.title}`, error);
      }
    });

    console.log(`Successfully imported ${importedCount} prayer items`);
  } catch (error) {
    console.error('Failed to import legacy data:', error);
    throw error;
  }
}

// Export individual converter function for testing
export { convertLegacyItem };